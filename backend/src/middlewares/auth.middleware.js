import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

// Verify JWT access token from cookies or Bearer header.
// Attaches the authenticated user to req.user and removes sensitive fields.
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from HTTP-only cookie or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        // Fetch user from DB, excluding password and refreshToken
        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );
    
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
