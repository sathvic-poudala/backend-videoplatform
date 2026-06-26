import { connection } from "mongoose";
import { Server, Socket } from "socket.io";
import { Room } from "../models/room.model.js";

let io;
const roomStates = new Map();
const userSockets = new Map();

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("room:join", async({ roomCode, accessToken }) => {
            try {
                const room = await Room.findOne({ roomCode })
                if (!room) return socket.emit("error", { message: "Room not found" });

                socket.join(roomCode);

                const state = roomStates.get(roomCode) || {
                    roomCode,
                    videoId: room.videoId,
                    isPlaying: room.isPlaying,
                    currentTime: room.currentTime,
                    lastUpdatedAt: room.lastUpdatedAt
                }

                if(room.isPlaying && state.lastUpdatedAt) {
                    const elapsed = (Date.now() - new Date(state.lastUpdatedAt).getTime())/1000;
                    state.currentTime = state.currentTime + elapsed;
                }

                socket.emit("room:state", state);

            } catch (error) {
                socket.emit("error", { message: "Failed to join room" });
            }
        })

        socket.on("video:play", async({ roomCode, currentTime, userId }) => {
            const room = await Room.findOne({ roomCode });
            if (!room) return;

            const isHost = room.hostId.toString() === userId;
            if (!isHost && !room.everyoneCanControl) {
                return socket.emit("error", { message: "Only host can control video" });
            }

            await Room.findByIdAndUpdate(room._id, {
                isPlaying: true,
                currentTime,
                lastUpdatedAt: new Date()
            })

            roomStates.set(roomCode, { roomCode, isPlaying: true, currentTime, lastUpdatedAt: new Date() });
            socket.to(roomCode).emit("video:play", { currentTime });
        })

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    })
}

export { io, roomStates };