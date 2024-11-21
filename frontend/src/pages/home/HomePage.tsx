import Topbar from "@/components/Topbar"
import { useMusicStore } from "@/stores/useMusicStore"
import { useEffect } from "react";
import FeaturedSection from "./components/Featured";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { SignedIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {

  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    featuredSongs,
    madeForYouSongs,
    trendingSongs,
    isLoading
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  },[initializeQueue,featuredSongs,madeForYouSongs,trendingSongs])

  return (
    <div className="rounded-md space-y-2 h-full">
      <Topbar/>
      <ScrollArea className="h-[calc(100vh-17vh)] bg-gradient-to-b from-zinc-900 to-zinc-800/50 rounded-md">
        <div className='p-4 sm:p-6 mb-[6rem]'>
					<SignedIn>
          <div className="flex items-center justify-between mb-4">
            <h1 className='text-xl sm:text-2xl font-bold'>Featured</h1>
            <Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
            {/* TODO: SHOW ALL BUTTON FUNCTION... take inspiration from anime vault infinite scrolling + pagination */}
              Show all
            </Button>
            
          </div>
					<FeaturedSection />

					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
          </SignedIn>
				</div>
      </ScrollArea>
    </div>
  )
}

export default HomePage