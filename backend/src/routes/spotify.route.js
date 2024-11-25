import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAlbumsForArtist, getProfile, getSpotifyAlbumById, getTrackScoresForAlbum, refreshToken, requestSpotify, searchItems } from "../controllers/spotify.controller.js";
const router = Router();

// Auth
router.get("/request", protectRoute, requestSpotify);
router.get("/profile", protectRoute, getProfile);
router.get("/refresh/:refresh_token", protectRoute, refreshToken);

// Search Page
router.get("/search", protectRoute, searchItems);

// AlbumPage
router.get("/album/:albumId", protectRoute, getSpotifyAlbumById);
router.get("/scores", protectRoute, getTrackScoresForAlbum);
router.get("/artist/albums/:artistId", protectRoute, getAlbumsForArtist);



export default router;  