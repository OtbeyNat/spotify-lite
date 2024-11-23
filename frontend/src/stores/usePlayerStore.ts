import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	currentLyrics: string[];

	initializeQueue: (songs: Song[]) => void;
	// TODO: add song to queue
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set,get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
	currentIndex: -1,
	currentLyrics: [],

	initializeQueue: (songs: Song[]) => {
		set({
			queue:songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex
		})
	},
	playAlbum: (songs: Song[], startIndex=0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artists[0].artistName}`,
			});
		}
		set({
			queue:songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		})
	},
	setCurrentSong:(song: Song | null)  => {
		if(!song) return;

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artists[0].artistName}`,
			});
		}

		const songIndex = get().queue.findIndex(s => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex
		});
	},
	togglePlay: () => {
		
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artists[0].artistName}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});
	},
	playNext: () => {
		const { currentIndex, queue } = get();
		const nextIndex = currentIndex + 1
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artists[0].artistName}`,
				});
			}

			set({
				currentSong: queue[nextIndex],
				currentIndex: nextIndex,
				isPlaying: true,
			})
		} else {
			set({isPlaying: false});

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
		}
			
	},
	playPrevious: () => {
		const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artists[0].artistName}`,
				});
			}

			set({
				currentSong: queue[prevIndex],
				currentIndex: prevIndex,
				isPlaying: true,
			})
		} else {
			set({isPlaying: false});

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Idle`,
				});
			}
		}
	}
}))