import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { Subscription } from '../models/subscription.model';

const createSubscription = async(userId,channelId) => {
    const createSubscrption = await Subscription.create({
        subscriber: userId,
        channel: channelId
    })

    if(!createSubscrption) {
        throw new ApiError(500,"something went wrong while creating a Subscrption")
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
        await createSubscription(userId,channelId)

        return res
        .status(200)
        .json(
            new ApiResponse(200,"subscription has been added")
        )
    }

    return res
    .status(200)
    .json(
            new ApiResponse(200,"subscription has been removed")
        )
    
})



export {
    toggleSubscription
}