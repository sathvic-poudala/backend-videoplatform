import mongoose from "mongoose";
import { Like } from "../models/like.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleLike = async (userId, field, objectId) => {
    const filter = { likedBy: userId, [field]: objectId };
    const deleted = await Like.findOneAndDelete(filter);
    if (deleted) return "like has been removed";
    await Like.create({ ...filter });
    return "like has been added";
};

const toggleVideoLike = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    const message = await toggleLike(req.user._id, "video", videoId)
    return res.status(200).json(new ApiResponse(200, message))
})

const toggleCommentLike = asyncHandler(async(req,res) => {
    const {commentId} = req.params
    const message = await toggleLike(req.user._id, "comment", commentId)
    return res.status(200).json(new ApiResponse(200, message))
})

const toggleTweetLike = asyncHandler(async(req,res) => {
    const {tweetId} = req.params
    const message = await toggleLike(req.user._id, "tweet", tweetId)
    return res.status(200).json(new ApiResponse(200, message))
})

const getLikedVideos = asyncHandler(async(req,res) => {
    const like = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true, $ne: null }
            }
        },
        {
            $lookup: {
                from:"videos",
                localField: "video",
                foreignField: "_id",
                as:"likedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        userName: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $arrayElemAt: ["$owner",0]
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                likedVideos: 1,
                likedBy: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    if(!like || like.length === 0) {
        return res.status(200).json(new ApiResponse(200, "no liked videos found", []))
    }

    return res.status(200).json(new ApiResponse(200, "liked videos fetched successfully", like))
})

export { 
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}
