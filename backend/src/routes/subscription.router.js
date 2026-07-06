import { Router } from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from '../controllers/subscription.controller.js';
import { validateObjectId } from "../middlewares/validate.middleware.js";

const router = Router()
router.use(verifyJWT);

router.route("/channel/:channelId").get(validateObjectId("channelId"), getUserChannelSubscribers).post(validateObjectId("channelId"), toggleSubscription);

router.route("/user/:subscriberId").get(validateObjectId("subscriberId"), getSubscribedChannels)
export default router