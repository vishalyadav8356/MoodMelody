const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    url:{
        type: String,
        required: [true, 'URL is required for a song'],
    },
    posterUrl:{
        type: String,
        required: [true, 'Poster URL is required for a song'],
    },
    title:{
        type: String,
        required: [true, 'Title is required for a song'],
    },
    mood:{
        type: String,
        enum:{
            values: ['happy', 'sad','surprised', 'neutral'],
            message: 'Mood must be either happy, sad, surprised or neutral'
        }
    }

})

const songModel = mongoose.model('song', songSchema);

module.exports = songModel;