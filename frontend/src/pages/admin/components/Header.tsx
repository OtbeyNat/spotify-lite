import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex items-center justify-center sm:justify-between'>
			<div className='flex items-center gap-2 sm:gap-3 mb-8'>
				<Link to='/' className='rounded-lg'>
					<img src='/spotify.png' className='size-8 sm:size-10 text-black' />
				</Link>
				<div className="select-none max-sm:text-center">
					<h1 className='sm:text-3xl font-bold'>Music Manager</h1>
					<p className='max-sm:text-sm text-zinc-400 mt-1'>Manage your music catalog</p>
				</div>
				<UserButton />
			</div>
		</div>
	);
};
export default Header;