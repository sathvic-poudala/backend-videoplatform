import mongoose, { Schema } from 'mongoose';

const chatMessageSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    }
},{
    timestamps: true
});

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);