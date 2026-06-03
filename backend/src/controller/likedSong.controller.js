const likedSong = require('../models/likedSong.model');

async function toggleLikedSong(req, res) {
  try {
    const { songId, songTitle, songUrl, posterUrl, emotion, confidence } = req.body;

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized user'
      });
    }

    if (!songId) {
      return res.status(400).json({
        message: 'songId is required'
      });
    }

    // Like song globally per user, not emotion-wise
    const existingLikedSong = await likedSong.findOne({ userId, songId });

    if (existingLikedSong) {
      await likedSong.deleteOne({ _id: existingLikedSong._id });

      return res.status(200).json({
        message: 'Liked song removed successfully',
        liked: false
      });
    }

    const safeEmotion = emotion || 'neutral';
    const safeConfidence = typeof confidence === 'number' ? confidence : 0;

    await likedSong.create({
      userId,
      songId,
      songTitle,
      songUrl,
      posterUrl,
      emotion: safeEmotion,
      confidence: safeConfidence
    });

    return res.status(201).json({
      message: 'Liked song added successfully',
      liked: true
    });
  } catch (error) {
    console.error('toggleLikedSong error:', error);

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}

async function getLikedSongs(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized user'
      });
    }

    const filter = { userId };

    if (req.query.emotion) {
      filter.emotion = req.query.emotion;
    }

    const songs = await likedSong.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Liked songs retrieved successfully',
      songs,
      total: songs.length
    });
  } catch (error) {
    console.error('getLikedSongs error:', error);

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}

async function checkLiked(req, res) {
  try {
    const { songId } = req.query;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized user'
      });
    }

    if (!songId) {
      return res.status(400).json({
        message: 'songId is required'
      });
    }

    // check only by songId
    const exists = await likedSong.exists({ userId, songId });

    return res.status(200).json({
      message: 'Liked song status retrieved successfully',
      liked: !!exists
    });
  } catch (error) {
    console.error('checkLiked error:', error);

    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}

module.exports = {
  toggleLikedSong,
  getLikedSongs,
  checkLiked
};
