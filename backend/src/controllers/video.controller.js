import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isUserAuthorized = async (videoId, userId) => {
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video does not exist");
  }

  if (!video.owner.equals(userId)) {
    throw new ApiError(400, "user not authorized");
  }

  return video;
};

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const video = await isUserAuthorized(videoId, userId);

  const toggledVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { isPublished: !video.isPublished },
    },
    {
      returnDocument: 'after'
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "toggled successfully", toggledVideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  const video = await isUserAuthorized(videoId, userId);

  await deleteFromCloudinary(video.videoFile);
  await deleteFromCloudinary(video.thumbnail);
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, "video deleted successfully", video));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const userId = req.user._id;

  const video = await isUserAuthorized(videoId, userId);

  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;

  if (req.file?.path) {
    const thumbnailDetails = await uploadOnCloudinary(req.file.path);
    if (!thumbnailDetails) {
      throw new ApiError(500, "error while uploading thumbnail to cloudinary");
    }
    if (video.thumbnail) {
      await deleteFromCloudinary(video.thumbnail);
    }
    updateFields.thumbnail = thumbnailDetails.url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateFields },
    { returnDocument: 'after' }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "video updated successfully", updatedVideo));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pipeline = [];

  if (userId && !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  if (userId) {
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  if (sortBy && sortType) {
    pipeline.push({
      $sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
    });
  }

  pipeline.push({
    $lookup: {
      from: "likes",
      localField: "_id",
      foreignField: "video",
      as: "likesList"
    }
  });

  pipeline.push({
    $addFields: {
      likesCount: { $size: "$likesList" }
    }
  });

  pipeline.push({
    $project: {
      likesList: 0
    }
  });

  pipeline.push({
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
  });

  pipeline.push({
    $addFields: {
      owner: { $first: "$owner" }
    }
  });

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videos = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "videos fetched successfully", videos));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => !field?.trim())) {
    throw new ApiError(400, "all fields are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video file and thumbnail are required");
  }

  const videoDetails = await uploadOnCloudinary(videoLocalPath);
  const thumbnailDetails = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoDetails || !thumbnailDetails) {
    throw new ApiError(500, "error while uploading to cloudinary");
  }

  const createdVideo = await Video.create({
    videoFile: videoDetails.url,
    thumbnail: thumbnailDetails.url,
    title,
    description,
    owner: req.user._id,
    duration: videoDetails.duration,
  });

  if (!createdVideo) {
    throw new ApiError(500, "something went wrong during creation of video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "video created successfully", createdVideo));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video does not exist");
  }

  const likesCount = await Like.countDocuments({ video: videoId });

  return res.status(200).json(new ApiResponse(200, "video found", { ...video.toObject(), likesCount }));
});

export {
  togglePublishStatus,
  deleteVideo,
  publishAVideo,
  updateVideo,
  getAllVideos,
  getVideoById,
};
