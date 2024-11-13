import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null >(null);

  const {currentSong, isPlaying, playNext} = usePlayerStore();
  
  // pause + play
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  },[isPlaying]);

  // song ends -> next song
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      // TODO: handle repeat; if repeat on start same song back to beginning
      playNext()
    }

    audio?.addEventListener("ended",handleEnded)

    return () => audio?.removeEventListener("ended",handleEnded);
  },[playNext])

  // handle song change

  useEffect(() => {
    if(!audioRef.current || !currentSong) return;
    const audio = audioRef.current;

    // check new song
    const isSongChanged = prevSongRef.current !== currentSong?.audioUrl;

    if (isSongChanged) {
      audio.src = currentSong?.audioUrl;
      // reset playback position
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;
      // play new song
      if (isPlaying) audio.play();
    }

  },[currentSong, isPlaying])


  return <audio ref={audioRef} />;
  
}

export default AudioPlayer