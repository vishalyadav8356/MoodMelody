const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User ID is required for a mood entry']
    },
    emotion:{
        type:String,
        enum:{
            values: ['happy', 'sad','surprised'],
            message: 'Emotion must be either happy, sad or surprised'
        }
    },
    confidence:{
        type:Number,
        min:0,  
        max:1,
        required:[true, 'Confidence score is required for a mood entry']
    },
    songId:{
        type: String,
    },
    songTitle:{
        type: String,
    },
    posterUrl:{
        type: String,
    },
},{
    timestamps: true
})

moodLogSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 7 }
);

const MoodLog = mongoose.model('MoodLog', moodLogSchema)

module.exports = MoodLog;