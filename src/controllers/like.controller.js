import mongoose from "mongoose"
import { Like } from "../models/like.model"
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


export { 
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike
}