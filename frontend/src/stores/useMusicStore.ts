import { axiosInstance } from "@/lib/axios";
import { Album, AlbumScoreInfo, BasicAlbumInfo, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	isFetchSongsLoading: boolean;
	isFetchAlbumsLoading: boolean;
	isFetchStatsLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	currentAlbumScores: AlbumScoreInfo | null;
	albumPageExtras: BasicAlbumInfo[] | null;

	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];

	songSearchResults: Song[];
	currentSearchQuery: string | null;
	currentSearchType: string;
	albumSearchResults: Album[];
	// cache results somewhere

	stats: Stats;

	fetchTrackScoresForAlbum: (ids: string) => Promise<void>;
	fetchSpotifyAlbumById: (id: string) => Promise<void>;
	fetchExtraAlbumsByArtist: (id: string, offset: number, limit: number) => Promise<void>;
	
	fetchAlbums: () => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set,get) => ({
    albums: [],
	songs: [],
    isLoading: false,
	isFetchSongsLoading: false,
	isFetchAlbumsLoading: false,
	isFetchStatsLoading: false,
    error: null,
	currentAlbum: null,
	currentAlbumScores: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	songSearchResults: [],
	albumSearchResults: [],
	albumPageExtras: [],
	currentSearchQuery: "",
	currentSearchType: "Tracks",
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},
	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},
	fetchSongs: async () => {
		set({ isFetchSongsLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isFetchSongsLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isFetchStatsLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isFetchStatsLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isFetchAlbumsLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isFetchAlbumsLoading: false });
		}
	},
	fetchTrackScoresForAlbum: async (ids:string) => {
		set({isLoading: true,error: null});
		try {
			const response = await axiosInstance.get(`/spotify/scores?token=${localStorage.getItem("spotify_access_token")}&ids=${ids}`);
			const scores = response.data.scores;
			const albumWithScores = {...get().currentAlbum!, songs: get().currentAlbum!.songs.map((song,index) => ({
				...song, popularity: scores[index],
			}))};
			console.log(albumWithScores);
			set({currentAlbumScores: {albumId: get().currentAlbum!.id,scores}, currentAlbum: albumWithScores});
		} catch (error: any ) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
		
	},
	fetchExtraAlbumsByArtist: async (id,offset,limit) => {
		set({isLoading: true,error: null});
		try {
			const response = await axiosInstance.get(`/spotify/artist/albums/${id}?offset=${offset}&limit=${limit}&token=${localStorage.getItem("spotify_access_token")}`);
			console.log(response.data.albums);
			set({albumPageExtras: response.data.albums})
		} catch (error:any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	// TODO: fetchAlbumsByUserId
	fetchSpotifyAlbumById: async (id) => {
		set({isLoading: true,error: null});
		try {
			const response = await axiosInstance.get(`/spotify/album/${id}?token=${localStorage.getItem("spotify_access_token")}`);
			// console.log(response);
			set({ currentAlbum: response.data});
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			// GET USERS TOP SONGS
			// long_term = ~1 year
			// medium_term = ~6 months
			// short_term = ~4 weeks
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}))