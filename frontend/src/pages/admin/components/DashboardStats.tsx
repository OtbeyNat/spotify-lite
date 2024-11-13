import { useMusicStore } from "@/stores/useMusicStore";
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";
import { useEffect } from "react";

const DashboardStats = () => {
	const { stats, songs, albums, fetchStats } = useMusicStore();

  	// console.log(stats);

	useEffect(() => {
		// when song/album is added or deleted, refetch stats
	  	fetchStats();
	}, [songs,albums])
	

	const statsData = [
		{
			icon: ListMusic,
			label: "Total Songs",
			value: stats.totalSongs.toString(),
			bgColor: "bg-emerald-500/10",
			iconColor: "text-emerald-500",
		},
		{
			icon: Library,
			label: "Total Albums",
			value: stats.totalAlbums.toString(),
			bgColor: "bg-violet-500/10",
			iconColor: "text-violet-500",
		},
		// TODO: change total artists to number of friends? -> add friend functionality?
		{
			icon: Users2,
			label: "Total Artists",
			value: stats.totalArtists.toString(),
			bgColor: "bg-orange-500/10",
			iconColor: "text-orange-500",
		},
		{
			icon: PlayCircle,
			label: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			bgColor: "bg-sky-500/10",
			iconColor: "text-sky-500",
		},
	];
  
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 select-none'>
			{statsData.map((stat) => {
				return (
					<StatsCard
						key={stat.label}
						icon={stat.icon}
						label={stat.label}
						value={stat.value}
						bgColor={stat.bgColor}
						iconColor={stat.iconColor}
					/>
				)	
			})}
		</div>
	);
};
export default DashboardStats;