import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
// import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
    // const { isAdmin } = useAuthStore();
    // console.log(isAdmin)
    return (
        <div className="flex items-center justify-between p-5 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-md">
            <div className="flex gap-2 items-center select-none">
                <img src="spotify.png" alt="logo" className="size-8"/>
                <p className="hidden sm:inline">Spotify LITE</p>
            </div>
            {/* TODO: search bar for songs */}
            <div className="flex items-center gap-4">    
                <SignedIn>
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