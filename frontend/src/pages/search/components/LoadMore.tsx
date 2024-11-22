import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer"

const LoadMore = ({loadMore}: {loadMore: ()=>Promise<void>}) => {
    const { ref, inView } = useInView();
    useEffect(() => {
        if (inView) {
            console.log(`Load More`);
            loadMore();
        }
    }, [inView])
    
    return (
        <div className="pb-10 flex items-center justify-center" ref={ref}>
            <Loader2 className='size-10 text-emerald-500 animate-spin' />
        </div>
    )
}

export default LoadMore;