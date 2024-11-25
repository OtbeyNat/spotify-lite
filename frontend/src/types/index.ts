export interface AlbumScoreInfo {
	albumId: string;
	scores: [{id: string;score: number;}]
}

export interface ArtistSongInfo {
	artistName: string;
	artistLink: string;
	artistId: string;
}

export interface CopyRightInfo {
	text: string;
	type: string;
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

export interface BasicAlbumInfo {
	id: string;
	title: string;
	artists: ArtistSongInfo[];
	imageUrl: string;
	releaseDate: string;
}

export interface Album {
	_id: string;
	id: string;
	albumType: string;
	title: string;
	artists: ArtistSongInfo[];
	imageUrl: string;
	albumUrl: string;
	totalTracks: number;
	releaseDate: string;
	songs: Song[];
	copyrights: CopyRightInfo[];
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