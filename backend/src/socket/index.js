import { Server } from "socket.io";
import { Room } from "../models/room.model.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import { verifySocketJWT } from "../utils/socketAuth.js";

let io;
const roomStates = new Map();

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.use(verifySocketJWT);

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
                    lastUpdatedAt: room.lastUpdatedAt,
                    hostId: room.hostId,
                    everyoneCanControl: room.everyoneCanControl
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

        socket.on("video:play", async({ roomCode, currentTime }) => {
            try {
                const room = await Room.findOne({ roomCode });
                if (!room) return;

                const isHost = room.hostId.equals(socket.user._id);
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
            } catch (error) {
                socket.emit("error", { message: "Failed to play video" });
            }
        })

        socket.on("video:pause", async({ roomCode, currentTime }) => {
            try {
                const room = await Room.findOne({ roomCode });
                if (!room) return;

                const isHost = room.hostId.equals(socket.user._id);
                if (!isHost && !room.everyoneCanControl) {
                    return socket.emit("error", { message: "Only host can control video" });
                }

                await Room.findByIdAndUpdate(room._id, {
                    isPlaying: false,
                    currentTime,
                    lastUpdatedAt: new Date()
                })

                roomStates.set(roomCode, { roomCode, isPlaying: false, currentTime, lastUpdatedAt: new Date() });
                socket.to(roomCode).emit("video:pause", { currentTime });
            } catch (error) {
                socket.emit("error", { message: "Failed to pause video" });
            }
        });

        socket.on("video:seek", async({ roomCode, currentTime }) => {
            try {
                const room = await Room.findOne({ roomCode });
                if (!room) return;

                const isHost = room.hostId.equals(socket.user._id);
                if (!isHost && !room.everyoneCanControl) {
                    return socket.emit("error", { message: "Only host can control video" });
                }

                await Room.findByIdAndUpdate(room._id, { currentTime });
                const state = roomStates.get(roomCode) || {};
                roomStates.set(roomCode, { ...state, currentTime });
                socket.to(roomCode).emit("video:seek", { currentTime });
            } catch (error) {
                socket.emit("error", { message: "Failed to seek video" });
            }
        });

        socket.on("chat:send", async({ roomCode, message }) => {
            try {
                if (!message?.trim()) {
                    return socket.emit("error", { message: "Empty message" });
                }

                const room = await Room.findOne({ roomCode });
                if (!room) return;

                await ChatMessage.create({ roomId: room._id, senderId: socket.user._id, message: message.trim() });
                io.to(roomCode).emit("chat:message", { userId: socket.user._id, message: message.trim(), createdAt: new Date() });
            } catch (error) {
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    })
}

export { io, roomStates };