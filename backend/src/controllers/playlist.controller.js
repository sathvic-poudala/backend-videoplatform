import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async(req, res) => {
    const { name, description = "" } = req.body;
    if(!name) {
        throw new ApiError(400,"name is required")
    }

    const createdPlaylist = await Playlist.create({
        name: name,
        description: description,
        createdBy: req.user._id
    })

    if(!createdPlaylist) {
        throw new ApiError(500,"something went wrong while creating a playlist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            "new playlist created successfully",
            createdPlaylist
        )
    )
})

const getUserPlaylists = asyncHandler(async(req, res) => {
    const {userId} = req.params

    const playlists = await Playlist.find({ createdBy: userId });

    if(!playlists || playlists.length === 0) {
        throw new ApiError(404, "user has no playlist");
        
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "found users playlists",
            playlists
        )
    )
})

const getPlaylistById = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
        }
    ])

    if (!playlist.length) {
        throw new ApiError(404, "Playlist was not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist found",
            playlist[0]
        )
    )
})

const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const {videoId, playlistId} = req.params

    const videoExists = await Video.findById(videoId)

    if(!videoExists) {
        throw new ApiError(404,"video does not exist")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"playlist does not exist")
    }

    if (!playlist.createdBy.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos:videoId 
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist updated",
            updatedPlaylist
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const {videoId, playlistId} = req.params

    const videoExists = await Video.findById(videoId)

    if(!videoExists) {
        throw new ApiError(404,"video does not exist")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"playlist does not exist")
    }

    if (!playlist.createdBy.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { 
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist updated",
            updatedPlaylist
        )
    )
})

const deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedPlaylist) {
        throw new ApiError(404,"playlist does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist deleted successfully",
            deletedPlaylist
        )
    )
})

const updatePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {description, name} = req.body

    if(!description || !name) {
        throw new ApiError(400,"all fields are required")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"playlist does not exist")
    }

    if (!playlist.createdBy.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }

    const updatedPlaylist= await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name: name,
            description: description
        },
        { new: true }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist details updated successfully",
            updatedPlaylist
        )
    )
})

export { 
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
 }