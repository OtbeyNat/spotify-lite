import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore"
import { useNavigate } from "react-router-dom";

const LyricsPage = () => {
    const { isMobile } = useChatStore();
    const navigate = useNavigate();

    if (isMobile) navigate("/");

    const { currentLyrics, currentSong } = usePlayerStore();

    return (
        <ScrollArea className={cn("h-[calc(100%)] bg-emerald-700 rounded-lg border-zinc-700/50 border-2 mb-4",!currentSong && "hidden")}>
            <div className="space-y-2 items-center">  
                {currentLyrics.map((line,index) => (
                    <p key={index} className='text-center text-sm sm:text-xl font-bold'>
                        {line}
                    </p>
                ))}
            </div>
        </ScrollArea>
    )
}

export default LyricsPage   