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

    // Overall distribution
    const distribution = await MoodLog.aggregate([
      { $match: { userId } },
      { $group: { _id: "$emotion", count: { $sum: 1 } } },
      { $project: { emotion: "$_id", count: 1, _id: 0 } },
    ]);

    // Last 7 days timeline
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
      { $sort: { "_id.date": 1 } },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allLogs = await MoodLog.find({ userId }).sort({ createdAt: -1 });
    const recentLogs = allLogs.filter((log, index) => {
      if (index === 0) return true
      return log.emotion !== allLogs[index - 1].emotion
    }).slice(0, 10)

    res.status(200).json({ distribution, timeline, recentLogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createMoodLog, getMoodLogs, getMoodStats };
