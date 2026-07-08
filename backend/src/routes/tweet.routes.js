import { Router } from 'express'
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createTweet, deleteTweet, getUserTweets, updateTweet } from '../controllers/tweet.controller.js';
import { validateObjectId, validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router();
router.use(verifyJWT);

// POST / - Create a new tweet
router.route("/").post(validateBodyFields(["content"]), createTweet);

// GET /user/:userId - Get all tweets of a user
router.route("/user/:userId").get(validateObjectId("userId"), getUserTweets);

// PATCH /:tweetId - Update tweet content
// DELETE /:tweetId - Delete a tweet
router.route("/:tweetId")
    .patch(validateObjectId("tweetId"), validateBodyFields(["content"]), updateTweet)
    .delete(validateObjectId("tweetId"), deleteTweet)

export default router
