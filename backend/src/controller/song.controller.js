const songModel = require('../models/song.model');
const storageService = require('../services/storage.service');
const id3 = require('node-id3');

async function uploadSong(req, res) {
    
  const songBuffer = req.file.buffer;
  const tags = id3.read(req.file.buffer);
  const {mood} = req.body;

  const [songFile, posterFile] = await Promise.all([

    storageService.uploadFile({
    buffer: songBuffer,
    filename: tags.title + ".mp3",
    folder: 'cohort2/moodify/songs'
    }),

    storageService.uploadFile({
    buffer: tags.image.imageBuffer,
    filename: tags.title + ".jpeg",
    folder: 'cohort2/moodify/posters'
    }) 

])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood: mood?.toLowerCase()
    })

    res.status(201).json({
        message: 'Song uploaded successfully',
        song
    })


}

async function getSongs(req, res){
    const {mood} = req.query;

    const songs = await songModel.aggregate([
        {
            $match: { mood: mood?.toLowerCase() }
        },
        {
            $sample: { size: 1 }
        }
    ])

    res.status(200).json({
        message: 'Songs fetched successfully',
        songs
    })

}

async function getAllSongs(req, res){
    const filter = {}
    if(req.query.mood) filter.mood = req.query.mood.toLowerCase();

    const songs = await songModel.find(filter).sort({ createdAt: -1 })

    res.status(200).json({
        message: 'Songs fetched successfully',
        songs
    })    
}    

module.exports = {
    uploadSong,
    getSongs,
    getAllSongs
}