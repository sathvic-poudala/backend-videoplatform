import crypto from "crypto"
import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from "../models/room.model";
import { ApiResponse } from "../utils/ApiResponse";

const generateRoomCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

const createRoom = asyncHandler(async(req,res) => {
    const { videoId } = req.body;
    const hostId = req.user._id;

    let roomCode;
    let existingRomm;
    do{
        roomCode = generateRoomCode()
        existingRomm = await Room.findOne({ roomCode })
    }while(existingRomm)


    const room = await Room.create({
        roomCode,
        hostId,
        videoId,
        isplaying: false,
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