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

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError(400, "playlist was not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "playlist found",
            playlist
        )
    )
})

const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const {videoId, playlistId} = req.params

    const videoExists = Video.findById(videoId)

    if(!videoExists) {
        throw new ApiError(200,"video dosenot exists")
    }

    const updatedPlaylist = Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: videoId 
        },
        {
            new: true
        }
    )

    if(!updatedPlaylist) {
        throw new ApiError(200,"playlist dosenot exists")
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





export { 
    createPlaylist, 
    getUserPlaylists,
    getPlaylistById
 }