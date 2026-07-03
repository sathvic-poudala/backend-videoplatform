import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const createComment = async(videoId, userId, content) => {
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })

    if(!comment) {
        throw new ApiError(500,"something went wrong while creating comment")
    }

    return {comment}
}

const getVideoComments = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const pageNum  = parseInt(page)
    const limitNum = parseInt(limit)
    const skip     = (pageNum - 1) * limitNum

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNum
        },
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
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "comments fetched successfully",
            comments
        )
    )
})

const addComment = asyncHandler(async(req,res) => {
    const {videoId} = req.params
    const userId = req.user._id
    const {content} = req.body

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video does not exist");
    }

    const comment = await createComment(videoId, userId, content)

    if (!comment) {
        throw new ApiError(500, "Failed to create comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "comment created successfully",
            comment
        )
    )
})

const updateComment = asyncHandler(async(req,res) => {
    const {content} = req.body
    const {commentId} = req.params

    const updatedComment = await Comment.findById(commentId)

    if(!updatedComment) {
        throw new ApiError(400,"comment dosenot exist")
    }

    if (updatedComment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    updatedComment.content = content
    await updatedComment.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "comment updated successfully",
            updatedComment
        )
    )
})

const deleteComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params

    const delComment = await Comment.findById(commentId)

    if(!delComment) {
        throw new ApiError(400,"comment dosenot exist")
    }

    if (delComment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await delComment.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "comment deleted successfully",
            {}
        )
    )
})

export { 
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}