import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/types";
import { SignedIn } from "@clerk/clerk-react";
import { SearchIcon } from "lucide-react";
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom";

const SearchPage = () => {
    const [ searchQuery, setSearchQuery ] = useState("")
    const [ offset, setOffset ] = useState(0);
    const [ limit, setLimit ] = useState(8);
    const [ showType, setShowType ] = useState("Tracks");
    const [ searchResults, setSearchResults ] = useState<Song[]>([])

    // const [ query ] = useSearchParams();
    // const [ resultType, setResultType ] = useState("");
    // const [ results, setResults ] = useState([]);


    const handleSearch = async () => {
        if (searchQuery) {  
            // check for previous searches

            alert(`Search: "${searchQuery}"`);
            const result = await axiosInstance.get(`spotify/search?token=${localStorage.getItem("spotify_access_token")!}&search=${searchQuery}&type=track,album&limit=${limit}&offset=${offset}`);
            console.log(result.data);
            
            const trackResults = result.data.tracks.items;
            var tracks = trackResults.map((item:any,index:number) => (
                {
                    _id: index, //TODO: change this later?
                    title: item.name,
                    artists: item.artists.map((artist:any) => (
                        {
                            artistName: artist.name,
                            artistLink: artist.external_urls.spotify,
                        }
                    )),
                    // albums: item.album,
                    // albumId: "1",
                    imageUrl: item.album.images[0].url,
                    audioUrl: item.preview_url,
                    trackUrl: item.external_urls.spotify,
                    popularity: item.popularity,
                    duration: item.duration_ms / 1000,
                    releaseDate: item.album.release_date,
                }
            ));
            console.log(tracks);
            useMusicStore.setState({songSearchResults: tracks});
            // const albumResults = result.data.albums.items;

        }
    }

    return (
        <main className='h-full rounded-lg space-y-2'>
            {/* search bar */}
            <div className="bg-zinc-900/75 backdrop-blur-md p-5 flex items-center justify-between gap-2 rounded-md">
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
            
            <div className="h-[calc(100vh-17vh)] bg-gradient-to-b from-zinc-900 to-zinc-800/50 rounded-md">
                <SignedIn>
                <div className="flex items-center gap-2 py-2 px-5 justify-end">
                    <Button 
                        className={cn("h-7 rounded-full",showType === "Tracks" && "text-black bg-emerald-600 hover:text-white hover:bg-zinc-800",showType !== "Tracks" && "text-white bg-zinc-800 hover:text-black hover:bg-emerald-600")}
                        onClick={() => {setShowType("Tracks")}}
                    >
                        Tracks
                    </Button>
                    <Button 
                        className={cn("h-7 rounded-full",showType === "Albums" && "text-black bg-emerald-600 hover:text-white hover:bg-zinc-800",showType !== "Albums" && "text-white bg-zinc-800 hover:text-black hover:bg-emerald-600")}
                        onClick={() => {setShowType("Albums")}}
                    >
                        Albums
                    </Button>
                </div>
                <ScrollArea>
                    <div className='p-4 sm:p-6 mb-[6rem]'>
                        {showType === "Tracks" && 
                            useMusicStore.getState().songSearchResults.map((song,index) => (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
                                
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>

                </SignedIn>
            </div>
        </main>
    )
}

export default SearchPage