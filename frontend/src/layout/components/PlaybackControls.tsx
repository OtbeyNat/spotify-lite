import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore"
import { SignedIn } from "@clerk/clerk-react";
import axios from "axios";
import { ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaybackControls = () => {
    const { currentSong, isPlaying, currentLyrics, togglePlay, playNext, playPrevious} = usePlayerStore();
    const { isMobile } = useChatStore();
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);
    // const [ lyrics, setLyrics ] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getSongLyrics = async() => {  
            try {
                await axios.get(`https://api.lyrics.ovh/v1/${currentSong?.artists[0].artistName}/${currentSong?.title}`)
                .then(res => {
                    // console.log(res.data.lyrics.split('\n'));
                    usePlayerStore.setState({currentLyrics: res.data.lyrics.split('\n')})
                    // setLyrics(res.data.lyrics.split('\n'));
                })
            } catch (error) {
                console.log(`No lyrics found for ${currentSong?.artists[0].artistName} - ${currentSong?.title}`);
                usePlayerStore.setState({currentLyrics: []});
            }
        }

        // console.log("playback useEffect")
        audioRef.current = document.querySelector("audio");

        const audio = audioRef.current;
        if (!audio) return;

        // get song lyrics
        if (currentSong?.artists[0].artistName && currentSong?.title) {
            getSongLyrics();
        }

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);

        const handleEnded = () => {
            usePlayerStore.setState({isPlaying: false})
        }
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        }
    },[currentSong])

    // useEffect(() => {
    //     if (audioRef.current) {

    //     }
    // },[])

    const handleSeek = (value: number[]) => {
        if(audioRef.current) {
            audioRef.current.currentTime = value[0];
        }
    }

    return (
        <footer className='h-full bg-zinc-900 border-t border-zinc-800 px-4 oveflow-hidden items-center'>
            <SignedIn>
                <div className='h-full max-w-[1800px] mx-auto justify-center items-center pt-4'>
                    {/* current song */}
                    <div className="flex justify-between items-center my-2">
                        <div className='flex items-center gap-4 md:min-w-[180px] lg:w-[30%]'>
                            {/* current song */}
                            {currentSong && (
                                <>
                                    <img
                                        src={currentSong.imageUrl}
                                        alt={currentSong.title}
                                        className='w-14 h-14 object-cover rounded-md select-none'
                                    />
                                    <div className='hidden md:flex md:flex-col min-w-0'>
                                        <div className='font-medium truncate hover:underline cursor-pointer select-none'>
                                            {currentSong.title}
                                        </div>
                                        <div className='text-sm flex gap-1 text-zinc-400 truncate select-none'>
                                            {currentSong.artists.map((artist) => <a key={artist.artistName} target="_blank" className="hover:underline cursor-pointer after:content-[','] last:after:content-['']" href={artist.artistLink}>{artist.artistName}</a>)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* controls */}
                        <div className='flex flex-col items-center gap-2 flex-1'>
                            <div className='flex items-center gap-4 sm:gap-6'>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    className='hidden sm:inline-flex hover:text-green-400 text-zinc-400'
                                    // TODO: onClick={shuffleSongs}
                                >
                                    <Shuffle className='h-4 w-4' />
                                </Button>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    className='hover:text-green-400 text-zinc-400'
                                    onClick={playPrevious}
                                    disabled={!currentSong}
                                >
                                    <SkipBack className='h-4 w-4' />
                                </Button>
                                <Button
                                    size='icon'
                                    className='bg-green-500 hover:bg-green-400 text-black rounded-full h-8 w-8'
                                    onClick={togglePlay}
                                    disabled={!currentSong}
                                >
                                    {isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
                                </Button>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    className='hover:text-green-400 text-zinc-400'
                                    onClick={playNext}
                                    disabled={!currentSong}
                                >
                                    <SkipForward className='h-4 w-4' />
                                </Button>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    className='hidden sm:inline-flex hover:text-green-400 text-zinc-400'
                                    // TODO: TOGGLE REPEAT
                                >
                                    <Repeat className='h-4 w-4' />
                                </Button>
                            </div>
                            <div className='hidden sm:flex items-center gap-2 w-full'>
                                <div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
                                <Slider
                                    value={[currentTime]}
                                    max={duration || 100}
                                    step={1}
                                    className='w-full hover:cursor-grab active:cursor-grabbing rounded-md'
                                    onValueChange={handleSeek}
                                />
                                <div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
                            </div>
                        </div>
                        {/* volume */}
                        <div className='flex items-center gap-4 md:min-w-[180px] lg:w-[30%] justify-end'>
                            <Button size='icon' variant='ghost' 
                                className={cn('hidden sm:flex',window.location.href.split('/')[3] !== "lyrics" ? "hover:text-green-400 text-zinc-400" : "text-green-400 hover:text-zinc-400")}
                                onClick={() => {
                                    if (window.location.href.split('/')[3] === "lyrics") {
                                        navigate(-1);
                                    } else {
                                        navigate("/lyrics");
                                    }
                                }}
                            >
                                <Mic2 className='h-4 w-4' />
                            </Button>
                            <Button size='icon' variant='ghost' className='hover:text-green-400 text-zinc-400 hidden sm:flex'>
                                {/* TODO: QUEUE COMPONENT -> rightside component: store toggle queue/friends... if mobile?? outlet component? */}
                                <ListMusic className='h-4 w-4' />
                            </Button>
                            <div className='flex items-center gap-2'>
                                <Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
                                    {/* TODO: toggle mute/unmute; unmute to the previous set volume (store) > 0 */}
                                    <Volume1 className='h-4 w-4' />
                                </Button>

                                <Slider
                                    value={[volume]}
                                    max={100}
                                    step={1}
                                    className='w-24 hover:cursor-grab active:cursor-grabbing'
                                    onValueChange={(value) => {
                                        setVolume(value[0]);
                                        if (audioRef.current) {
                                            audioRef.current.volume = value[0] / 100;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* lyrics */}
                    {isMobile && currentLyrics.length > 0 && <ScrollArea className={cn("mt-4 h-[calc(100%-10vh)] bg-emerald-700 rounded-lg border-zinc-700/50 border-2 mb-4",!isPlaying && "hidden")}>
                        <div className="space-y-2 items-center">  
                            {currentLyrics.map((line,index) => (
                                <p key={index} className='text-center text-sm sm:text-xl font-bold'>
                                    {line}
                                </p>
                            ))}
                        </div>
                    </ScrollArea>}
                </div>
                
            </SignedIn>
        </footer>
    )
}

export default PlaybackControls