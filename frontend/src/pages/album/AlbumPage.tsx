import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
// import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
// import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Loader, Pause, Play, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
    const { albumId } = useParams();
	const navigate = useNavigate();
	const { fetchSpotifyAlbumById, fetchTrackScoresForAlbum, fetchExtraAlbumsByArtist, albumPageExtras, currentAlbumScores, currentAlbum, isLoading } = useMusicStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const [ totalDuration, setTotalDuration ] = useState("");
	const [ formattedReleaseDate, setFormattedReleaseDate] = useState("");

    useEffect(() => {
		// spotify api fetch
		if (albumId) {
			fetchSpotifyAlbumById(albumId);
		};
		
	}, [fetchSpotifyAlbumById, albumId]);
	
	const formatTotalDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds - (hours * 3600)) / 60);
		const remainingSeconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));
		if (hours === 0) {
			return `${minutes.toString()} min` + ' ' + `${remainingSeconds.toString()} sec`;
		} else {
			return `${hours.toString()} hr` + ' ' + `${minutes.toString()} min`;
		}
	}

	
	useEffect(() => {
		const getScores = async (ids:string) => {
			fetchTrackScoresForAlbum(ids);
		}

		const getExtraAlbums = async (id:string, offset:number, limit:number) => {
			fetchExtraAlbumsByArtist(id, offset, limit);
		}

		if (currentAlbum?.songs && currentAlbum.songs.length > 0) {
			if (totalDuration === "") {
				const total = currentAlbum.songs.reduce((sum,song) => sum + song.duration, 0)
				setTotalDuration(formatTotalDuration(total));
			}
			if (!currentAlbumScores) {
				const ids = currentAlbum?.songs.map((song) => song.id).join(',');
				getScores(ids);
			}
		}
		if (currentAlbum?.releaseDate && formattedReleaseDate === "") {
			// console.log(currentAlbum.releaseDate);
			const date = new Date(currentAlbum.releaseDate);
			setFormattedReleaseDate(date.toLocaleString('en-us', {month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC'}));
		}

		if (currentAlbum?.artists && currentAlbum.artists.length > 0 && albumPageExtras !== null) {
			// get extra albums by artist
			getExtraAlbums(currentAlbum.artists[0].artistId,0,8);
		}
	},[currentAlbum])

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song.id === currentSong?.id);
		if (isCurrentAlbumPlaying) togglePlay();
		else {
			// start playing the album from the beginning
			playAlbum(currentAlbum?.songs, 0);
		}
	}

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;

		playAlbum(currentAlbum?.songs, index);
	};

    return (
        <div className="h-full space-y-2">
			<Topbar/>
			{
				isLoading ? (
					<div className='h-screen w-full flex items-center justify-center'>
						<Loader className='size-8 text-emerald-500 animate-spin' />
					</div>
				) 
				:
				(
					<ScrollArea className="h-[calc(100%-80px)] rounded-md">
						{/* Main Content */}
						<div className="relative min-h-full">
							{/* bg gradient */}
							{/* TODO: dynamic color based on picture */}
							<div 
								className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none'
								aria-hidden='true'
							/>
							<div className="relative z-10">
								<div className="flex flex-col sm:flex-row sm:space-x-6 p-6 pb-2 sm:pr-0 sm:pt-10 sm:pl-10 gap-2 select-none">
									<img
										src={currentAlbum?.imageUrl}
										alt={currentAlbum?.title}
										className='w-[100vw] justify-center sm:w-[240px] sm:h-[240px] shadow-xl rounded '
									/>
									<div className='flex flex-col sm:justify-end'>
										<p className='text-xs sm:text-sm sm:font-medium select-none'>{currentAlbum?.albumType && currentAlbum?.albumType.charAt(0).toUpperCase() + currentAlbum?.albumType.slice(1)}</p>
										<h1 className='font-bold text-xl my-2 pr-2 sm:text-7xl sm:my-4 select-none'><a href={currentAlbum?.albumUrl} className="hover:underline" target="_blank">{currentAlbum?.title}</a></h1>
										<div className='flex items-center gap-1 text-sm text-zinc-100 select-none'>
											<span className='font-medium text-white'>
												{currentAlbum?.artists.map((artist,index) => 
													<span key={artist.artistName}>
														{index !== 0 && ' •'} <a target="_blank" className="hover:underline cursor-pointer" href={artist.artistLink}> {artist.artistName}</a>
													</span>
												)}
											</span>
											<span className="text-zinc-400">• {currentAlbum?.releaseDate.split('-')[0]}</span>
											<span className="text-zinc-400 hidden sm:inline">• {currentAlbum?.songs.length} songs, {totalDuration}</span>
										</div>
									</div>
								</div>
								{/* play button */}
								<div className='px-6 sm:pl-10 py-4 flex items-center gap-6'>
									<Button
										onClick={handlePlayAlbum}
										size='icon'
										className='w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all'
									>
										{isPlaying && currentAlbum?.songs.some((song) => song.id === currentSong?.id) ? (
											<Pause className='h-3 w-3 sm:h-7 sm:w-7 text-black bg' />
										) : (
											<Play className='h-3 w-3 sm:h-7 sm:w-7 text-black' />
										)}
									</Button>
								</div>
								
								{/* Table */}
								<div className="bg-black/20 backdrop-blur-sm">
									<div
										className='hidden sm:grid sm:grid-cols-[16px_2fr_1fr_1fr_0.25fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5 select-none'
									>
										<div>#</div>
										<div>Title</div>
										<div className="flex items-center justify-end">Popularity</div>
										<div/>
										<div className="flex items-center justify-end"><Clock className='h-4 w-4'/></div>
									</div>
									{/* song list */}
									<div className="px-4 sm:px-6">
										<div className="space-y-2 py-4">
											{currentAlbum?.songs.map((song,index) => {
												const isCurrentSong = currentSong?.id === song.id;

												return (
													<div 
														key={song.id}
														className={`grid grid-cols-[4fr_1fr] sm:grid-cols-[16px_2fr_1fr_1fr_0.25fr] gap-4 px-2 sm:px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer items-center`}
														onDoubleClick={() => handlePlaySong(index)}
													>
														<div 
															className='hidden sm:flex items-center select-none'
															onClick={() => handlePlaySong(index)}
														>
															{isCurrentSong && isPlaying ? (
																<div className='size-4 text-green-500'>♫</div>
															) : (
																<span className='group-hover:hidden'>{index + 1}</span>
															)}
															{!isCurrentSong && (
																<Play className='h-4 w-4 hidden group-hover:block' />
															)}
														</div>

														<div className='flex items-center gap-3'>
															{/* <img src={song.imageUrl} alt={song.title} className='size-10' /> */}
															<div>
																<div className={cn('font-medium text-white select-none',isCurrentSong && 'text-green-500')}>{song.title}</div>
																<div className='text-sm flex text-zinc-400 truncate gap-1 select-none'>
																	{song.artists.map((artist) => <a key={artist.artistName} target="_blank" className="hover:underline cursor-pointer after:content-[','] last:after:content-['']" href={artist.artistLink}>{artist.artistName}</a>)}
																</div>
															</div>
														</div>
														<div className='hidden sm:flex items-center justify-end select-none'>{song.popularity}</div>
														<div className="flex justify-end items-center">
															{/* TODO: if track saved, show green check else on hover show + */}
															{/* <Check className="rounded-full bg-green-500 size-4 text-black text-sm"/> */}
															<PlusCircle className="hidden bg-transparent size-4 rounded-full text-zinc-500 group-hover:flex hover:bg-transparent hover:text-white"/>
														</div>
														<div className='hidden sm:flex items-center justify-end select-none'>{formatDuration(song.duration)}</div>
													</div>
												)
											})}
										</div>
									</div>
									{/* copyrights */}
									<div className='px-5 sm:px-8 pb-4 flex flex-col justify-start select-none'>
										<p className="text-sm text-zinc-400">{formattedReleaseDate}</p>
										{currentAlbum?.copyrights.map((line,index) => (
											<p key={index} className='text-xs text-zinc-400'>{line.type === "C" && line.text.charAt(0) !== "©" && "©"}{line.type === "P" && line.text.charAt(0) !== "℗" && "℗"} {line.text}</p>
										))}
									</div>
									{/* TODO: More Albums By Artist */}
									<div className="px-5 sm:px-8 pb-4 space-y-2">
										<div className="text-xl font-bold select-none">More by {currentAlbum?.artists[0].artistName}</div>
										<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-4">
											{albumPageExtras?.map((album) => (
												<div
													key={album.id}
													className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
												>
													<div className='relative mb-4'>
														<div className='aspect-square rounded-md shadow-lg overflow-hidden select-none'>
															<img
																src={album.imageUrl}
																alt={album.title}
																className='object-cover transition-transform duration-300 
																group-hover:scale-105 cursor-pointer'
																onClick={() => {navigate(`/albums/${album.id}`)}}
															/>
														</div>
													</div>
													<h3 className='font-medium mb-2 truncate select-none'>{album.title}</h3>
													<div className='text-sm flex text-zinc-400 truncate gap-1 select-none'>
														{album.releaseDate.split('-')[0]} • {album.artists.map((artist) => <a key={artist.artistName} target="_blank" className="hover:underline cursor-pointer after:content-[','] last:after:content-['']" href={artist.artistLink}>{artist.artistName}</a>)}
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</ScrollArea>
				)
			}
        </div>
    )
}

export default AlbumPage