import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, {timestamps: true});

// Static helper: find by shortUrl and increment clicks atomically
shortUrlSchema.statics.findByShortUrlAndIncrement = function(short) {
  return this.findOneAndUpdate(
    { shortUrl: short },
    { $inc: { clicks: 1 } },
    { new: true }
  ).exec();
};

export const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);