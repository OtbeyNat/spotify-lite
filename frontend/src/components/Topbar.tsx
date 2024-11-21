import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, MessageCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useChatStore } from "@/stores/useChatStore";


const Topbar = () => {
    const { isMobile } = useChatStore();

    return (
        <div className="flex items-center justify-between p-5 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-md">
            <div className="flex gap-2 items-center select-none">
                <Link to={"/"}>
                    <img src="spotify.png" alt="logo" className="size-8"/>
                </Link>
                <p className="hidden sm:inline">Spotify LITE</p>
            </div>
            <div className="flex items-center gap-4">
                <SignedIn>
                    {/* <Button onClick={getToken}>
                        Spotify Auth
                    </Button> */}
                    {isMobile && 
                        <Link
                            to={"/chat"}
                            className={cn(buttonVariants({
                                    variant: "ghost",
                                    className: "text-white hover:bg-zinc-800",
                            }))}
                        >
                            <MessageCircle className='size-3' />
                        </Link>
                    }
                    {isMobile &&
                        <Link
                            to={"/search"}
                            className={cn(buttonVariants({
                                    variant: "ghost",
                                    className: "text-white hover:bg-zinc-800",
                            }))}
                        >
                            <Search className='size-3' />
                        </Link>
                    }
                    <Link to={"/admin"} className={cn(buttonVariants({
                        variant: "outline"
                    }))}>
                        <LayoutDashboardIcon className="size-4 mr-2"/>
                        Dashboard
                    </Link>
                </SignedIn>

                <SignedOut>
                    <SignInOAuthButtons/>
                </SignedOut>

                <UserButton />
            </div>
        </div>
    )
}

export default Topbar