import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getProfile, refreshToken, requestSpotify, searchItems } from "../controllers/spotify.controller.js";
const router = Router();

// Auth
router.get("/request", protectRoute, requestSpotify);
router.get("/profile", protectRoute, getProfile);
router.get("/refresh/:refresh_token", protectRoute, refreshToken);

router.get("/search", protectRoute, searchItems)



export default router;  