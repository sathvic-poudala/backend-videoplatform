import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { subscribe } from "diagnostics_channel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Video } from "../models/video.model";

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
                    $size: "$videos.views"
                },
                totalLikes: {
                    $size: "$videos.likes"
                },
                totalViews: {
                    $size: "$videos.views"
                }
            }
        },
        {
            $project: {
                totalSubscribers: 1,
                totalLikes: 1,
                totalViews: 1,
                totalVideos: 1
            }
        }
    ])

    if(!stats) {
        throw new ApiError(400, "no stats found")
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

const getChannelVideos  = asyncHandler(async(req,req) => {
    //Get all the videos uploaded by the channel
    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    if(!videos) {
        throw new ApiError(400,"no videos found")
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