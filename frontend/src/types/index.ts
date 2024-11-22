export interface ArtistSongInfo {
	artistName: string;
	artistLink: string;
}

export interface Song {
	_id: string;
	id: string;
	title: string;
	artists: ArtistSongInfo[];
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	trackUrl: string;
	popularity: number;
	duration: number;
	releaseDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	id: string
	title: string;
	artists: ArtistSongInfo[];
	imageUrl: string;
	totalTraacks: number;
	releaseDate: string;
	releaseYear: number;
	songs: Song[];
	createdAt: string;
	updatedAt: string;
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

// TODO: update type interfaces to include necessary spotify webapi information