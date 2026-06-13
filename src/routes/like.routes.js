import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from '../controllers/like.controller';


const router = Router()
app.use(verifyJWT)//all of these routes require verifyjwt

//routes
router.route("/video/:videoId").post(toggleVideoLike)
router.route("/comment/:commentId").post(toggleCommentLike)
router.route("/tweet/:tweetId").post(toggleTweetLike)


export default router