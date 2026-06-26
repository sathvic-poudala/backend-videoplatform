import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/room.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const generateRoomCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

const createRoom = asyncHandler(async(req,res) => {
    const { videoId } = req.body;
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
        currentTime: 0
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

export { createRoom, joinRoom };