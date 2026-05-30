const MoodLog = require("../models/moodLog.model.js");
const mongoose = require('mongoose')

async function createMoodLog(req, res){
    const {emotion, confidence, songId, posterUrl} = req.body
    const userId = req.user.id

    const moodLogEntry = await MoodLog.create({
        userId, emotion, confidence, songId, posterUrl
    })

    res.status(201).json({
        message: 'Mood log created successfully',
        moodLog: moodLogEntry
    })
}

async function getMoodLogs(req, res){
    const filter = {userId: req.user.id}
    if (req.query.emotion) filter.emotion = req.query.emotion;

    const log = await MoodLog.find(filter).sort({createdAt: -1}).limit(50)

    res.status(200).json({
        message: 'Mood logs retrieved successfully',
        log,
        total: log.length
    })
}

async function getMoodStats(req, res) {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id) // ← convert karo

        const distribution = await MoodLog.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: '$emotion', count: { $sum: 1 } } },
            { $project: { emotion: '$_id', count: 1, _id: 0 } }
        ])

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const timeline = await MoodLog.aggregate([
            {
                $match: {
                    userId: userId,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%m/%d', date: '$createdAt' } },
                        emotion: '$emotion'
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.date': 1 } }
        ])

        res.status(200).json({ distribution, timeline })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createMoodLog,
    getMoodLogs,
    getMoodStats
}