const MoodLog = require("../models/moodLog.model.js");
const mongoose = require("mongoose");

async function createMoodLog(req, res) {
  try {
    const { emotion, confidence, songTitle, posterUrl } = req.body;
    const userId = req.user.id;

    await MoodLog.create({ userId, emotion, confidence, songTitle, posterUrl });

    res.status(201).json({ message: "Mood log created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMoodLogs(req, res) {
  try {
    const filter = { userId: req.user.id };
    if (req.query.emotion) filter.emotion = req.query.emotion;

    const logs = await MoodLog.find(filter).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      message: "Mood logs retrieved successfully",
      logs,
      total: logs.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getMoodStats(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Last 7 days start
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Distribution (Last 7 Days Only)
    const distribution = await MoodLog.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          emotion: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Timeline (Last 7 Days)
    const timeline = await MoodLog.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%m/%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
            emotion: "$emotion",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.date": 1,
        },
      },
    ]);

    // Today's Logs Only
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const recentLogs = await MoodLog.find({
      userId,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      distribution,
      timeline,
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = { createMoodLog, getMoodLogs, getMoodStats };
