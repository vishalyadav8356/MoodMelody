const  express = require('express')
const likedSongController = require('../controller/likedSong.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/like', authMiddleware.authUser , likedSongController.toggleLikedSong)
router.get('/liked', authMiddleware.authUser , likedSongController.getLikedSongs)
router.get('/liked/check', authMiddleware.authUser ,  likedSongController.checkLiked)

module.exports = router;