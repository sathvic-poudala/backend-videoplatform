import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async(req,res) => {
    // Return total views, subscribers, videos, and likes for authenticated channel
    const userId = req.user._id
    
    const stats = await User.aggregate([
        // Filter to authenticated user only
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        // Join with subscriptions collection to count channel subscribers
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subcribers"
            }
        },
        // Join with likes collection to count likes on user's content
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedBy",
                as: "likes"
            }
        },
        // Join with videos collection to compute views and count videos
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
            }
        },
        // Shape output: size of joined arrays gives counts, $sum aggregates views
        {
            $addFields: {
                totalSubscribers: {
                    $size: "$subcribers"
                },
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                },
                totalLikes: {
                    $size: "$likes"
                }
            }
        },
        // Keep only the computed stats in the response payload
        {
            $project: {
                totalSubscribers: 1,
                totalViews: 1,
                totalVideos: 1,
                totalLikes: 1
            }
        }
    ])

    if(!stats || !stats.length) {
        throw new ApiError(404, "no stats found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "data found",
            stats
        )
    )
})

const getChannelVideos  = asyncHandler(async(req,res) => {
    // Fetch all videos uploaded by the authenticated channel
    const videos = await Video.aggregate([
        // Match documents where owner is the authenticated user
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    if(!videos || !videos.length) {
        throw new ApiError(404,"no videos found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "videos fetched successfully",
            videos
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}