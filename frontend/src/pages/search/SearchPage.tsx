import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
// import { Song } from "@/types";
import { SignedIn } from "@clerk/clerk-react";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react"
import { Link } from "react-router-dom";
import PlayButton from "../home/components/PlayButton";
import LoadMore from "./components/LoadMore";

const SearchPage = () => {
    const [ searchQuery, setSearchQuery ] = useState("")
    const [ offset, setOffset ] = useState(0);
    // const [ limit, setLimit ] = useState(12);
    const limit = useRef(12);
    const [ showType, setShowType ] = useState(useMusicStore.getState().currentSearchType);
    const { songSearchResults, albumSearchResults, currentSearchQuery } = useMusicStore();
    // const [ searchResults, setSearchResults ] = useState<Song[]>([])

    // const [ query ] = useSearchParams();
    // const [ resultType, setResultType ] = useState("");
    // const [ results, setResults ] = useState([]);

    const loadMoreResults = async () => {
        const result = await axiosInstance.get(`spotify/search?token=${localStorage.getItem("spotify_access_token")!}&search=${searchQuery}&type=track,album&limit=${limit.current}&offset=${offset}`);
        console.log(...result.data.tracks);
        useMusicStore.setState({songSearchResults: [...useMusicStore.getState().songSearchResults, ...result.data.tracks], albumSearchResults: [...useMusicStore.getState().albumSearchResults, ...result.data.albums],})
        setOffset((current) => current + limit.current)
    }

    const handleSearch = async () => {
        if (searchQuery && searchQuery !== currentSearchQuery) {  
            // check for previous searches (cached result)
            setOffset(0);
            const result = await axiosInstance.get(`spotify/search?token=${localStorage.getItem("spotify_access_token")!}&search=${searchQuery}&type=track,album&limit=${limit.current}&offset=${offset}`);
            console.log(result.data);
            
            useMusicStore.setState({songSearchResults: result.data.tracks, albumSearchResults: result.data.albums, currentSearchQuery: searchQuery})
            setOffset((current) => current + limit.current)
        }
    }

    return (
        <main className='h-full rounded-lg space-y-2'>
            {/* search bar */}
            <div className="bg-zinc-900/75 backdrop-blur-md py-5 px-4 sm:px-6 flex items-center justify-between gap-2 rounded-md">
                <div className="flex gap-2 items-center select-none">
                    <Link to={"/"}>
                        <img src="spotify.png" alt="logo" className="size-8"/>
                    </Link>
                    <p className="hidden sm:inline">Spotify LITE</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='bg-zinc-800 border-zinc-700'
                        />
                        <SearchIcon 
                            className="absolute top-2.5 right-2 size-4 cursor-pointer"
                            onClick={handleSearch}
                        />    
                    </div>
                </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-18vh)] bg-gradient-to-b from-zinc-900 to-zinc-800/50 rounded-md">
                {/* add loading state? */}
                <div className="flex items-center pt-4 mb-4 px-4 sm:px-6">
                    <div className="flex w-full justify-start">
                        <p className="hidden sm:text-lg sm:inline-flex">{currentSearchQuery && `Previous Search: ${currentSearchQuery}`}</p>
                    </div>
                    <div className="flex w-full justify-end gap-2">
                        <Button 
                            className={cn("h-6 rounded-full",showType === "Tracks" && "text-black bg-emerald-600 hover:text-white hover:bg-zinc-800",showType !== "Tracks" && "text-white bg-zinc-800 hover:text-black hover:bg-emerald-600")}
                            onClick={() => {
                                setShowType("Tracks");
                                useMusicStore.setState({currentSearchType: "Tracks"});
                            }}
                        >
                            Tracks
                        </Button>
                        <Button 
                            className={cn("h-6 rounded-full",showType === "Albums" && "text-black bg-emerald-600 hover:text-white hover:bg-zinc-800",showType !== "Albums" && "text-white bg-zinc-800 hover:text-black hover:bg-emerald-600")}
                            onClick={() => {
                                setShowType("Albums");
                                useMusicStore.setState({currentSearchType: "Albums"});
                            }}
                        >
                            Albums
                        </Button>
                    </div>
                </div>
                {showType === "Tracks" && 
                <div className='py-2 px-4 sm:px-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>      
                        {/* motiondiv */}
                        {songSearchResults.map((song) => (
                            <div
                                key={song.id}
                                className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
                            >
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
                                />
                                <div className='flex-1 p-4'>
                                    <p className='font-medium truncate'>{song.title}</p>
                                    <div className='text-sm flex text-zinc-400 truncate gap-1 select-none'>
                                        {song.artists.map((artist) => <a key={artist.artistName} target="_blank" className="hover:underline cursor-pointer after:content-[','] last:after:content-['']" href={artist.artistLink}>{artist.artistName}</a>)}
                                    </div>
                                    
                                </div>
                                <PlayButton song={song} />
                            </div>
                        ))}
                    </div>
                </div>
                }

                {showType === "Albums" && 
                    <div className='py-2 px-4 sm:px-6'>                            
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {albumSearchResults.map((album) => (
                                <div
                                    key={album.id}
                                    className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
                                >
                                    <div className='relative mb-4'>
                                        <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                                            <img
                                                src={album.imageUrl}
                                                alt={album.title}
                                                className='object-cover transition-transform duration-300 
                                                group-hover:scale-105'
                                            />
                                        </div>
                                    </div>
                                    <h3 className='font-medium mb-2 truncate'>{album.title}</h3>
                                    <div className='text-sm flex text-zinc-400 truncate gap-1 select-none'>
                                        {album.artists.map((artist) => <a key={artist.artistName} target="_blank" className="hover:underline cursor-pointer after:content-[','] last:after:content-['']" href={artist.artistLink}>{artist.artistName}</a>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {songSearchResults.length > 0 && showType === "Tracks" && <LoadMore loadMore={loadMoreResults}/>}
                {albumSearchResults.length > 0 && showType === "Albums" && <LoadMore loadMore={loadMoreResults}/>}
                {/* include album results length */}
            </ScrollArea>
        </main>
    )
}

export default SearchPage