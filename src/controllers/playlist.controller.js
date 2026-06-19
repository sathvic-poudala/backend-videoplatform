import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

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
            createPlaylist
        )
    )
})

const getUserPlaylists = asyncHandler(async(req, res) => {
    const {userId} = req.params

    const playlists = await Playlist.find({ createdBy: userId });

    if(!playlists) {
        throw new ApiError(400, "user has no playlist");
        
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

    const videoExists = Video.findById(videoId)

    if(!videoExists) {
        throw new ApiError(404,"video dosenot exists")
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

    if(!updatedPlaylist) {
        throw new ApiError(404,"playlist dosenot exists")
    }

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

    const videoExists = Video.findById(videoId)

    if(!videoExists) {
        throw new ApiError(404,"video dosenot exists")
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

    if(!updatedPlaylist) {
        throw new ApiError(404,"playlist dosenot exists")
    }

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
        throw new ApiError(404,"playlist dosenot exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist deleted successfully",
            deletePlaylist
        )
    )
})

const updatePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params
    const {description, name} = req.body

    if(!description || !name) {
        throw new ApiError(400,"all feilds are required")
    }

    const updatedPlaylist= await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name: name,
            description: description
        }
    )

    if(!updatePlaylist) {
        throw new ApiError(404,"playlist dosenot exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist details updated successfully",
            updatePlaylist
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