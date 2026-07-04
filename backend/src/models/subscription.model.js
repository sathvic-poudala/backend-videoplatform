import mongoose,{ Schema } from "mongoose";
import { User } from "./user.model.js";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,//the user who is subscribing
        ref: 'User',
        required: true
    },
    channel: {
        type: Schema.Types.ObjectId,//the channel or user to which our curruser is subscribing
        ref: 'User',
        required: true
    }
});

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription",subscriptionSchema)