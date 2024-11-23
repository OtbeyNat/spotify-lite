import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";
import FriendsActivity from "./components/FriendsActivity";
import { useEffect } from "react";
import PlaybackControls from "./components/PlaybackControls";
import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "@/stores/useChatStore";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkAccessToken } from "@/lib/utils";
// import axios from "axios";
// import { axiosInstance } from "@/lib/axios";
// import { isTokenValid } from "@/lib/utils";

const MainLayout = () => {
    const { user } = useUser();
    const [ tokens ] = useSearchParams();
    const { isMobile } = useChatStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            // setIsMobile(window.innerWidth < 768);
            useChatStore.setState({ isMobile: window.innerWidth < 768 });
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        // const test = async () => {
        //     const result = await axiosInstance.get(`/spotify/profile?token=${localStorage.getItem("spotify_access_token")!}`);
        //     console.log(result);
        // };
        if (user) {
            console.log("homepage check")
            checkAccessToken()
            .then(() => console.log("spotify_access_token",localStorage.getItem("spotify_access_token")))
        }
    },[])

    // useEffect runs when browser redirect with tokens in params
    useEffect(() => {        
        const accessToken = tokens.get('access_token');
        const refreshToken = tokens.get('refresh_token');
        const expires_in = tokens.get('expires_in');
        if (accessToken && refreshToken && expires_in) {
            console.log("Update Access Token",accessToken);
            const expireTime = Date.now() + parseInt(expires_in) * 1000;
            // console.log("EXPIRE TIME",expireTime.toString());
            localStorage.setItem("spotify_access_token",accessToken);
            localStorage.setItem("spotify_refresh_token",refreshToken);
            localStorage.setItem("expire_time",expireTime.toString());
            navigate("/");
        }
    },[tokens])

    return (
        <div className="h-screen bg-black text-white flex flex-col gap-2">
                <ResizablePanelGroup direction="vertical" className='flex-1 flex h-full overflow-hidden p-2'>
                    {/* left side */}
                    {/* TODO: spacebar event listener to toggle play song in queue */}
                    
                    <ResizablePanel defaultSize={80} minSize={isMobile ? 0 : 50} maxSize={isMobile ? 100 : 90 }>
                        
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel defaultSize={isMobile ? 0 : 20} minSize={0} maxSize={user && !isMobile ? 20 : 0}>
                                <LeftSideBar />
                            </ResizablePanel>

                            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

                            {/* Main Content */}
                            <ResizablePanel>
                                <Outlet />
                            </ResizablePanel>

                            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

                            {/* right side */}
                            <ResizablePanel defaultSize={isMobile ? 0 : 20} minSize={0} maxSize={isMobile ? 0 : 20} collapsedSize={0}>
                                <FriendsActivity />
                            </ResizablePanel>
                        </ResizablePanelGroup>

                    </ResizablePanel>

                    <ResizableHandle className="w-2 bg-black rounded-lg transition-colors p-1.5"/>
                    
                    <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={isMobile ? 100 : 20}>
                        <PlaybackControls />
                    </ResizablePanel>

                </ResizablePanelGroup>

                

        </div>
    )
}

export default MainLayout;