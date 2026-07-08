import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router()

router.use(verifyJWT)

//routes
// GET /stats - Get channel stats (views, subscribers, total videos, etc.)
router.route("/stats").get(getChannelStats)

// GET /videos - Get all videos of the authenticated channel
router.route("/videos").get(getChannelVideos)

export default router
