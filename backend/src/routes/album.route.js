import { Router } from 'express';
import { getAlbumById, getAllAlbums } from '../controllers/album.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

// TODO: get albums for user
router.get("/", protectRoute, getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;