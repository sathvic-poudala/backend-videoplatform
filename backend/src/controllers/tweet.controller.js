import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Tweet } from '../models/tweet.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === '') {
        throw new ApiError(400, "Content is required");
    }

    const createdTweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id
    });

    if (!createdTweet) {
        throw new ApiError(500, "Could not create a tweet");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Tweet created successfully",
                createdTweet
            )
        );
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
    
    const tweets = await Tweet.find({
        owner: userId
    }).sort({ createdAt: -1 });

    // Note: find() returns an empty array if no documents found, not null
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Tweets retrieved successfully",
                tweets
            )
        );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    // Validate tweetId
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Validate content
    if (!content || content.trim() === '') {
        throw new ApiError(400, "Content is required");
    }

    // Find the tweet first to check ownership
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet doesn't exist");
    }

    // Check if the user is the owner of the tweet
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    // Update the tweet and return the updated document
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: { content: content.trim() }
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Tweet updated successfully",
                updatedTweet
            )
        );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    // Validate tweetId
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find the tweet first to check ownership
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet doesn't exist");
    }

    // Check if the user is the owner of the tweet
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    // Delete the tweet
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Tweet deleted successfully",
                deletedTweet
            )
        );
});


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};
