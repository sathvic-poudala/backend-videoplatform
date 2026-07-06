import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Subscription } from '../models/subscription.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createSubscription = async(userId,channelId) => {
    if (userId.equals(channelId)) {
        throw new ApiError(400, "Cannot subscribe to yourself");
    }

    const createSubscrption = await Subscription.create({
        subscriber: userId,
        channel: channelId
    })

    if(!createSubscrption) {
        throw new ApiError(500,"something went wrong while creating a Subscription")
    }

    return {createSubscrption}
}

const toggleSubscription = asyncHandler(async(req,res) => {
    const {channelId} = req.params
    const userId = req.user._id

    const subscription = await Subscription.findOneAndDelete({
        subscriber: userId,
        channel: channelId
    })

    if(!subscription) {
        try {
            await createSubscription(userId,channelId)
            return res.status(200).json(new ApiResponse(200, "subscription has been added"))
        } catch (err) {
            if (err.code === 11000) {
                await Subscription.findOneAndDelete({ subscriber: userId, channel: channelId })
                return res.status(200).json(new ApiResponse(200, "subscription has been removed"))
            }
            throw err
        }
    }

    return res.status(200).json(new ApiResponse(200, "subscription has been removed"))
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId,
    });

    return res.status(200).json(new ApiResponse(200, "found subs", totalSubscribers))
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channels",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            userName: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$channels",
        }
    ])

    return res.status(200).json(new ApiResponse(200, "found channels user subed to", subscribedChannels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
