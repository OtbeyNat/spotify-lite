import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStats } from "../controllers/stat.controller.js";

const router = Router();

// TODO: get stats for user (saved songs, playlists, friends)
router.get("/", protectRoute, getStats);

export default router;