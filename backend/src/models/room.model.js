import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    hostId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    isPlaying: {
        type: Boolean,
        default: false
    },
    currentTime: {
        type: Number,
        default: 0
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    },
    everyoneCanControl: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 86400000)
    }
}, {
    timestamps: true
});

roomSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

export const Room = mongoose.model('Room', roomSchema);