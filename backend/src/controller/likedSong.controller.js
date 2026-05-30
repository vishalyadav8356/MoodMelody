const likedSong = require('../models/likedSong.model');

async function toggleLikedSong(req, res){

    const {songId, songTitle, songUrl, posterUrl, emotion, confidence } = req.body
    const userId = req.user.id

    const existingLikedSong = await likedSong.findOne({userId, songId, emotion})

    if(existingLikedSong){
        await likedSong.deleteOne({_id: existingLikedSong._id});
        return res.status(200).json({
            message: 'Liked song removed successfully',
            liked: false
        })
    }

    await likedSong.create({
        userId, songId, songTitle, songUrl, posterUrl, emotion, confidence
    })

    console.log('req.user:', req.user);

    res.status(201).json({
        message: 'Liked song added successfully',
        liked: true
    })        
}

async function getLikedSongs(req, res){
    const filter = {userId: req.user.id}

    if (req.query.emotion) filter.emotion = req.query.emotion
    
    const songs = await likedSong.find(filter).sort({createdAt: -1})

    res.status(200).json({
        message: 'Liked songs retrieved successfully',
        songs,
        total: songs.length
    })
}

async function checkLiked(req, res){
   const {songId, emotion} = req.query

   if(!songId || !emotion){
       return res.status(400).json({
           message: 'songId and emotion are required'
       })
   }

   const exists = await likedSong.exists({userId: req.user.id, songId, emotion})

    res.status(200).json({
        message: 'Liked song status retrieved successfully',
        liked: !!exists
    })
}

module.exports = {
    toggleLikedSong,
    getLikedSongs,
    checkLiked
}
