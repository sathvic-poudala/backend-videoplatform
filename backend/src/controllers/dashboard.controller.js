import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async(req,res) => {
    //get total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id
    
    const stats = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subcribers"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedBy",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
            }
        },
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
    //Get all the videos uploaded by the channel
    const videos = await Video.aggregate([
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