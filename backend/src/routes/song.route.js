import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controllers/song.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// TODO: get saved songs for user
router.get("/", protectRoute, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

// TODO: implement logic for fetching songs from spotify api
// TODO: implement logic for searching

export default router;