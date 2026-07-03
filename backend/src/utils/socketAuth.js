import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifySocketJWT = async (socket, next) => {
    const token = socket.handshake.auth?.token || 
        socket.handshake.headers?.cookie?.split('accessToken=')[1]?.split(';')[0];
    
    if (!token) return next(new Error("Authentication error"));
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
};