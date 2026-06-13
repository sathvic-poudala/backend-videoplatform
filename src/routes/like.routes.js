import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from '../controllers/like.controller';


const router = Router()
app.use(verifyJWT)//all of these routes require verifyjwt

//routes
router.route("/toggle/video/:videoId").post(toggleVideoLike)
router.route("/toggle/comment/:commentId").post(toggleCommentLike)
router.route("/toggle/tweet/:tweetId").post(toggleTweetLike)


export default router