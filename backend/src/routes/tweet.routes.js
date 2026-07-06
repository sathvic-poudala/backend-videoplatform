import { Router } from 'express'
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from '../controllers/tweet.controller.js';
import { validateObjectId, validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(validateBodyFields(["content"]), createTweet);

router.route("/user/:userId").get(validateObjectId("userId"), getUserTweets);

router.route("/:tweetId")
    .patch(validateObjectId("tweetId"), validateBodyFields(["content"]), updateTweet)
    .delete(validateObjectId("tweetId"), deleteTweet)

export default router