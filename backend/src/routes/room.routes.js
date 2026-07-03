import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createRoom, joinRoom, getChatHistory, updateRoomSettings } from '../controllers/room.controller.js';

const router = Router()

router.route('/').post(verifyJWT, createRoom)
router.route('/join/:roomCode').get(verifyJWT, joinRoom)
router.route('/:roomCode/chat').get(verifyJWT, getChatHistory)
router.route('/:roomCode').patch(verifyJWT, updateRoomSettings)

export default router;