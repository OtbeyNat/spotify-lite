import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMusicStore } from "@/stores/useMusicStore"
import { SignedIn, useUser } from "@clerk/clerk-react"
import { HomeIcon, Library, MessageCircle, Search } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

const LeftSideBar = () => {

    const { albums, fetchAlbums, isLoading } = useMusicStore();
    const { user } = useUser();

    useEffect(() => {
        
        if (user) fetchAlbums();
        // TODO: FETCH ALBUMS BASED ON USER
    },[fetchAlbums, user]);

    // console.log({albums});

    return (
        <div className="h-full flex flex-col gap-2">
            {/* Navigation */}

            <div className="rounded-lg bg-zinc-900 p-4 items-center">
                <div className="space-y-2 ">
                    <Link to={"/"}
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                className: "w-full justify-start text-white hover:bg-zinc-800",
                            })
                        )}
                    >
                        <HomeIcon className="mr-2 size-5"/>
                        <span className="hidden md:inline truncate">Home</span>
                    </Link>

                    <SignedIn>
                        <Link
                            to={"/chat"}
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    className: "w-full justify-start text-white hover:bg-zinc-800",
                                })
                            )}
                        >
                            <MessageCircle className='mr-2 size-5' />
                            <span className='hidden md:inline truncate'>Messages</span>
                        </Link>
                        <Link
                            to={"/search"}
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    className: "w-full justify-start text-white hover:bg-zinc-800",
                                })
                            )}
                        >
                            <Search className='mr-2 size-5' />
                            <span className='hidden md:inline truncate'>Search</span>
                        </Link>
                    </SignedIn>
                </div>
            </div>

            {/* Library */}
            <div className='flex-1 rounded-lg bg-zinc-900 p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-centertext-white px-2 select-none'>
                        <Library className='size-5 mr-2' />
                        <span className='hidden md:inline truncate'>Playlists</span>
                    </div>
                </div>

                <ScrollArea className='h-[calc(100vh-300px)]'>
                    <div className="space-y-2">
                        {isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 items-center justify-between'>
										<p className='font-medium truncate'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default LeftSideBar