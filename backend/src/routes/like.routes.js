import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos } from '../controllers/like.controller.js';
import { validateObjectId } from '../middlewares/validate.middleware.js';

const router = Router()
router.use(verifyJWT)

router.route("/toggle/video/:videoId").post(validateObjectId("videoId"), toggleVideoLike)
router.route("/toggle/comment/:commentId").post(validateObjectId("commentId"), toggleCommentLike)
router.route("/toggle/tweet/:tweetId").post(validateObjectId("tweetId"), toggleTweetLike)
router.route("/videos").get(getLikedVideos)

export default router