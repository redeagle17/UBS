import mongoose, {Schema} from "mongoose";

const blacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createAt: {
        type: Date,
        default: Date.now(),
        expires: 86400
    }
});

export const blacklistModel = mongoose.model("Blacklist_Token", blacklistSchema)