import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { subscribe } from "diagnostics_channel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

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

export {
    getChannelStats
}