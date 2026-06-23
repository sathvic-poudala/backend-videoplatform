import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createLike = async(userId,objectId,objectType) => {
    const createLike = await Like.create({
        video: objectType === "video" ? objectId : null,
        comment: objectType === "comment" ? objectId : null,
        tweet: objectType === "tweet" ? objectId : null,
        likedBy: userId
    })

    if(!createLike) {
        throw new ApiError(500,"something went wrong while creating a like")
    }

    return {createLike};
}

const toggleVideoLike = asyncHandler(async(req,res) => {
    const {videoId} = req.params

    const userId = req.user._id

    const liked = await Like.findOneAndDelete({
        likedBy: userId,
        video: videoId
    })

    if(!liked) {
        await createLike(userId,videoId,"video")

        return res
        .status(200)
        .json(
            new ApiResponse(200,"like has been added")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"like has been removed")
    )

})

const toggleCommentLike = asyncHandler(async(req,res) => {
    const {commentId} = req.params

    const userId = req.user._id

    const liked = await Like.findOneAndDelete({
        likedBy: userId,
        video: commentId
    })

    if(!liked) {
        await createLike(userId,commentId,"comment")

        return res
        .status(200)
        .json(
            new ApiResponse(200,"like has been added")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"like has been removed")
    )

})

const toggleTweetLike = asyncHandler(async(req,res) => {
    const {tweetId} = req.params

    const userId = req.user._id

    const liked = await Like.findOneAndDelete({
        likedBy: userId,
        video: tweetId
    })

    if(!liked) {
        await createLike(userId,tweetId,"tweet")

        return res
        .status(200)
        .json(
            new ApiResponse(200,"like has been added")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"like has been removed")
    )

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
        throw new ApiError(404, "videos not found"); 
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "liked videos fetched successfully",
            like
        )
    )
})

//TASK TO BE DONE!!! 
// need to update like in video every time a like created and deleted
export { 
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}