import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";

const SongsTable = () => {
    const { songs, isLoading, error, deleteSong } = useMusicStore();

	// TODO: songs from table should be all saved songs for specific user; USERS MODEL INCLUDE: array of saved song ids?

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
			</div>
		);
	}

    if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}



    return (
        <Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800/50 select-none'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Date</TableHead>
					<TableHead className='text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{songs.map((song) => (
					<TableRow key={song._id} className='hover:bg-zinc-800/50'>
						<TableCell>
							<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover select-none' />
						</TableCell>
						<TableCell className='font-medium select-none'>{song.title}</TableCell>
						<TableCell className='text-sm flex text-zinc-400 truncate gap-1 select-none'>
							{song.artists.map((artist) => <a key={artist.artistName} target="_blank" className="hover:underline cursor-pointer after:content-[','] last:after:content-['']" href={artist.artistLink}>{artist.artistName}</a>)}
						</TableCell>
						<TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400 select-none'>
								<Calendar className='h-4 w-4' />
								{song.createdAt.split("T")[0]}
							</span>
						</TableCell>

						<TableCell className='text-right'>
							<div className='flex gap-2 justify-end'>
								<Button
									variant={"ghost"}
									size={"sm"}
									className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
									onClick={() => deleteSong(song._id)}
								>
									<Trash2 className='size-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
    )
}

export default SongsTable