import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/room.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ChatMessage } from "../models/chatMessage.model.js";

const generateRoomCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

const createRoom = asyncHandler(async(req,res) => {
    const { videoId, everyoneCanControl } = req.body;
    const hostId = req.user._id;

    let roomCode;
    let existingRoom;
    do{
        roomCode = generateRoomCode()
        existingRoom = await Room.findOne({ roomCode })
    }while(existingRoom)


    const room = await Room.create({
        roomCode,
        hostId,
        videoId,
        isPlaying: false,
        currentTime: 0,
        everyoneCanControl: everyoneCanControl || false
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            "Room created",
            { roomCode }
        )
    )
})

const joinRoom = asyncHandler(async(req,res) => {
    const { roomCode } = req.params

    const room = await Room.findOne({ roomCode })
        .populate('videoId', 'videoFile title duration')
        .populate('hostId', 'userName fullName avatar')

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                "Room found", 
                room
    ));
})

const getChatHistory = asyncHandler(async(req,res) => {
    const { roomCode } = req.params
    const room = await Room.findOne({ roomCode })
    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const chatHistory = await ChatMessage.find({ roomId: room._id })
        .populate('senderId', 'userName fullName avatar')
        .sort({ createdAt: 1 })
        .limit(100)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, "Chat history fetched", chatHistory
            )
        )
})

const updateRoomSettings = asyncHandler(async(req,res) => {
    const { roomCode } = req.params
    const { everyoneCanControl } = req.body
    const userId = req.user._id

    const room = await Room.findOne({ roomCode })
    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    if (room.hostId.toString() !== userId) {
        throw new ApiError(403, "Only host can update room settings");
    }

    const updatedRoom = await Room.findByIdAndUpdate(
        room._id,
        { $set: { everyoneCanControl } },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Room settings updated", updatedRoom)
        )
})

export { createRoom, joinRoom, getChatHistory, updateRoomSettings };