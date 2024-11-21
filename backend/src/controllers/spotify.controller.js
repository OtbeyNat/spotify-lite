import axios from "axios";

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;


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

		res.send(result.data);

		// if (result) {
			
		// }
		/* if type == "track"
			const tracks = result.tracks.items => array of objects (results) set by limit

			const track_name = tracks[i].name
			const popularity = tracks[i].popularity
			https://stackoverflow.com/questions/26055358/gradual-color-change-by-a-variable

			const preview_url = tracks[i].preview_url
			const external_url = tracks[i].external_urls.spotify
			const duration = tracks[i].duration_ms
			const image_url = tracks[i].images.[0].url

			const artists = tracks[i].artists => ARRAY OF MULTIPLE ARTISTS
			const artist_name = artists[i].name
			consts artist_link = artists[i].external_urls.spotify
			
			const albums = tracks[i].albums
			const release date = tracks[i].albums.release_date
		*/

	} catch (error) {
		console.log("search error", error)
	}
}

export const requestSpotify = async (req,res,next) => {
	try {
		// console.log(client_id,client_secret);
		var code = req.query.code || null;
		// res.redirect(
		// 	`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000/auth-callback/' : '/'}?code=${code}`
		// )
		const body = {
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: `${process.env.NODE_ENV === "development" ? `http://localhost:5000/api/spotify/request` : "/api/spotify/request"}`
		};
		const response = await axios.post('https://accounts.spotify.com/api/token', body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
			},
		})
		res.redirect(`${process.env.NODE_ENV === "development" ? `http://localhost:3000/` : "/"}?access_token=${response.data.access_token}&refresh_token=${response.data.refresh_token}&expires_in=${response.data.expires_in}`)
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