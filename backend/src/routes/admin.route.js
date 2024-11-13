import { Router } from 'express';
import { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin } from '../controllers/admin.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'

const router = Router();

router.use(protectRoute);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;