import { Router } from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from '../controllers/subscription.controller.js';
import { validateObjectId } from "../middlewares/validate.middleware.js";

const router = Router()
router.use(verifyJWT);

// GET /channel/:channelId - Get list of subscribers for a channel
// POST /channel/:channelId - Toggle subscription status for a channel
router.route("/channel/:channelId")
    .get(validateObjectId("channelId"), getUserChannelSubscribers)
    .post(validateObjectId("channelId"), toggleSubscription);

// GET /user/:subscriberId - Get list of channels subscribed by a user
router.route("/user/:subscriberId").get(validateObjectId("subscriberId"), getSubscribedChannels)
export default router
