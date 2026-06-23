import { Router } from 'express';
import { verify } from 'jsonwebtoken';

const router = Router()
router.use(verifyJWT);

router.route("/channel/:channelId").get(getSubscribedChannels).post(toggleSubscription);


export default router