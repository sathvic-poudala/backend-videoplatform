import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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

    const comment = createComment(videoId, userId, content)

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

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {   
            new: true
        }
    )
    
    if(!updatedComment) {
        throw new ApiError(400,"comment dosenot exist")
    }
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

    const delComment = await Comment.findByIdAndDelete(commentId)

    if(!delComment) {
        throw new ApiError(400,"comment dosenot exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "comment deleted successfully",
            delComment
        )
    )
})

export { 
    addComment,
    updateComment,
    deleteComment
}