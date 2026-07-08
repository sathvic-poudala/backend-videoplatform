import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createRoom, joinRoom, getChatHistory, updateRoomSettings } from '../controllers/room.controller.js';
import { validateObjectId } from "../middlewares/validate.middleware.js";

import { validateBodyFields } from "../middlewares/validate.middleware.js";

const router = Router()

// POST / - Create a new room for a video
router.route('/').post(verifyJWT, validateBodyFields(["videoId"]), createRoom)

// GET /join/:roomCode - Join an existing room using room code
router.route('/join/:roomCode').get(verifyJWT, joinRoom)

// GET /:roomCode/chat - Get chat history for a room
router.route('/:roomCode/chat').get(verifyJWT, getChatHistory)

// PATCH /:roomCode - Update room settings
router.route('/:roomCode').patch(verifyJWT, updateRoomSettings)

export default router;
