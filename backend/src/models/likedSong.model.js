const mongoose = require("mongoose");

const likedSongSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for a liked song"],
    },
    songId: {
      type: String,
      required: [true, "Song ID is required for a liked song"],
    },
    posterUrl: {
      type: String,
      default: "",
    },
    songTitle: {
      type: String,
      required: [true, "Song title is required for a liked song"],
    },
    emotion: {
      type: String,
      enum: {
        values: ["happy", "sad", "surprised", "neutral"],
        message: "Emotion must be either happy, sad, surprised or neutral",
      },
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: [true, "Confidence score is required for a liked song"],
    },
  },
  {
    timestamps: true,
  },
);

likedSongSchema.index({ userId: 1, songId: 1 }, { unique: true });

const likedSongModel = mongoose.model("likedSong", likedSongSchema);

module.exports = likedSongModel;
