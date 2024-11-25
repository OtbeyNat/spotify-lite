import axios from "axios";

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export const getAlbumsForArtist = async (req,res,next) => {
	try {
		const artistId = req.params.artistId;
		const token = req.query.token;
		const offset = req.query.offset;
		const limit = req.query.limit;
		const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&offset=${offset}&limit=${limit}`, {
			headers: { 'Authorization': `Bearer ${token}` }
		});
		const albums = response.data.items.map((album) => ({
			id: album.id,
			title: album.name,
			// artistSchema
			artists: album.artists.map((artist) => (
				{
					artistName: artist.name,
					artistLink: artist.external_urls.spotify,
					artistId: artist.id,
				}
			)),
			imageUrl: album.images[0].url,
			releaseDate: album.release_date,
		}));
		res.json({albums});
	} catch (error) {
		console.log("getAlbumsForArtist", error);
	}
}

export const getTrackScoresForAlbum = async (req,res,next) => {
	try {
		const ids = req.query.ids;
		const token = req.query.token;
		const response = await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`,{
			headers: { 'Authorization': `Bearer ${token}` }
		});
		const scores = response.data.tracks.map((track) => (track.popularity))
		res.json({scores});
	} catch (error) {
		console.log("getTrackScoresForAlbum error", error);
	}
}

export const getSpotifyAlbumById = async (req,res,next) => {
	try {
		const albumId = req.params.albumId;
		const token = req.query.token;
		const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
			headers: { 'Authorization': `Bearer ${token}` }
		});
		// console.log(result);

		res.send({
			id: response.data.id,
			albumType: response.data.album_type,
			title: response.data.name,
			artists: response.data.artists.map((artist) => (
				{
					artistName: artist.name,
					artistLink: artist.external_urls.spotify,
					artistId: artist.id,
				}
			)),
			imageUrl: response.data.images[0].url,
			totalTracks: response.data.total_tracks,
			releaseDate: response.data.release_date,
			albumUrl: response.data.external_urls.spotify,
			copyrights: response.data.copyrights,
			songs: response.data.tracks.items.map((song) => (
				{
					id: song.id,
					title: song.name,
					artists: song.artists.map((artist) => (
						{
							artistName: artist.name,
							artistLink: artist.external_urls.spotify,
							artistId: artist.id,
						}
					)),
					// albums: item.album,
					// albumId: "1",
					imageUrl: response.data.images[0].url,
					audioUrl: song.preview_url,
					trackUrl: song.external_urls.spotify,
					popularity: 100,
					duration: song.duration_ms / 1000,
					releaseDate: response.data.release_date,
				}
			))
		});

	} catch (error) {
		console.log("getSpotifyAlbumById Error", error)
	}
	
}

export const searchItems = async (req,res,next) => {
	try {
		const token = req.query.token;
		const query = req.query.search;
		const type = req.query.type;
		const limit = req.query.limit;
		const offset = req.query.offset;

		const result = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=${limit}&offset=${offset}&include_external=audio`, {
			headers: { 'Authorization': `Bearer ${token}` }
		});

		const trackResults = result.data.tracks.items;
            var tracks = trackResults.map((item) => {
                if (item) {
					return {
						id: item.id,
						title: item.name,
						artists: item.artists.map((artist) => (
							{
								artistName: artist.name,
								artistLink: artist.external_urls.spotify,
								artistId: artist.id,
							}
						)),
						// albums: item.album,
						// albumId: "1",
						imageUrl: item.album.images[0].url,
						audioUrl: item.preview_url,
						trackUrl: item.external_urls.spotify,
						popularity: item.popularity,
						duration: item.duration_ms / 1000,
						releaseDate: item.album.release_date,
					}
				}
			});
            // console.log(tracks);
            const albumResults = result.data.albums.items;
			// console.log(albumResults)
            var albums = albumResults.map((item) => {
				if (item) {
					return {
						id: item.id,
						title: item.name,
						// artistSchema
						artists: item.artists.map((artist) => (
							{
								artistName: artist.name,
								artistLink: artist.external_urls.spotify,
								artistId: artist.id,
							}
						)),
						imageUrl: item.images[0].url,
						totalTracks: item.total_tracks,
						releaseDate: item.release_date,
						songs: [],
					}
				}
			});
            // console.log(albums);

		res.json({tracks,albums});

	} catch (error) {
		console.log("search error", error)
	}
}

export const requestSpotify = async (req,res,next) => {
	try {
		var code = req.query.code || null;
		const redirect_uri = `${process.env.NODE_ENV === "development" ? `http://localhost:5000/api/spotify/request` : "https://spotify-lite.onrender.com/api/spotify/request"}`;
		// var client_id = process.env.SPOTIFY_CLIENT_ID;
		// var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
		console.log(client_id,client_secret);
		const response = await axios.post('https://accounts.spotify.com/api/token', 
			`grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`
			, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
			},
		});

		// const response = await fetch('https://accounts.spotify.com/api/token', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 		'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
		// 	},
		// 	body: JSON.stringify(body),
		// 	json: true
		// })
		console.log(response.data);
		res.redirect(`${process.env.NODE_ENV === "development" ? `http://localhost:3000/` : "https://spotify-lite.onrender.com/"}?access_token=${response.data.access_token}&refresh_token=${response.data.refresh_token}&expires_in=${response.data.expires_in}`)
		// res.send(response.data);

	} catch (error) {
		console.log("Error requestSpotify", error);
	}
};

export const refreshToken = async (req,res,next) => {
	try {
		const refresh_token = req.params.refresh_token;
		const body = {
			refresh_token: refresh_token,
			grant_type: 'refresh_token',
		};
		const response = await axios.post('https://accounts.spotify.com/api/token', body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
			},
		})
		res.send(response.data);
	} catch (error) {
		console.log("Error refreshToken", error);
	}
}

export const getProfile = async (req,res,next) => {
	try {
		const token = req.query.token;
		const result = await axios.get("https://api.spotify.com/v1/me", {
			headers: { 'Authorization': `Bearer ${token}` }
		});
		// console.log(result)
		res.send(result.data);
	} catch (error) {
		console.log("getProfile error", error);
	}
}
