import mongoose,{ Schema } from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        index: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        index: true
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
        index: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
},{
    timestamps: true
});

likeSchema.index({ likedBy: 1, video: 1 }, { unique: true, sparse: true });
likeSchema.index({ likedBy: 1, comment: 1 }, { unique: true, sparse: true });
likeSchema.index({ likedBy: 1, tweet: 1 }, { unique: true, sparse: true });

export const Like = mongoose.model('Like', likeSchema);