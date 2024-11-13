import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSideBar from "./components/LeftSideBar";
import FriendsAcitivity from "./components/FriendsAcitivity";
import { useEffect } from "react";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";
import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "@/stores/useChatStore";


const MainLayout = () => {
    const { user } = useUser();
    // const [isMobile, setIsMobile] = useState(false);
    const { isMobile } = useChatStore();
	useEffect(() => {
		const checkMobile = () => {
			// setIsMobile(window.innerWidth < 768);
            useChatStore.setState({ isMobile: window.innerWidth < 768 });
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <ResizablePanelGroup direction="horizontal" className='flex-1 flex h-full overflow-hidden p-2'>
                {/* left side */}
                {/* TODO: spacebar event listener to toggle play song in queue */}
                
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={user && !isMobile ? 20 : 0}>
                    <LeftSideBar />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

                {/* Main Content */}
                <ResizablePanel>
                    <Outlet />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

                {/* right side */}
                <ResizablePanel defaultSize={20} minSize={0} maxSize={isMobile ? 0 : 20} collapsedSize={0}>
                    <FriendsAcitivity />
                </ResizablePanel>
            </ResizablePanelGroup>
            <PlaybackControls />
        </div>
    )
}

export default MainLayout;