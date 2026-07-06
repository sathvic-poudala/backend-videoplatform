import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createRoom, joinRoom, getChatHistory, updateRoomSettings } from '../controllers/room.controller.js';
import { validateObjectId } from "../middlewares/validate.middleware.js";

import { validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

router.route('/').post(verifyJWT, validateBodyFields(["videoId"]), createRoom)
router.route('/join/:roomCode').get(verifyJWT, joinRoom)
router.route('/:roomCode/chat').get(verifyJWT, getChatHistory)
router.route('/:roomCode').patch(verifyJWT, updateRoomSettings)

export default router;