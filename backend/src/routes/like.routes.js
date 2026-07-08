import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos } from '../controllers/like.controller.js';
import { validateObjectId } from '../middlewares/validate.middleware.js';

const router = Router()
router.use(verifyJWT)

// POST /toggle/video/:videoId - Toggle like status on a video
router.route("/toggle/video/:videoId").post(validateObjectId("videoId"), toggleVideoLike)

// POST /toggle/comment/:commentId - Toggle like status on a comment
router.route("/toggle/comment/:commentId").post(validateObjectId("commentId"), toggleCommentLike)

// POST /toggle/tweet/:tweetId - Toggle like status on a tweet
router.route("/toggle/tweet/:tweetId").post(validateObjectId("tweetId"), toggleTweetLike)

// GET /videos - Get all videos liked by current user
router.route("/videos").get(getLikedVideos)

export default router
