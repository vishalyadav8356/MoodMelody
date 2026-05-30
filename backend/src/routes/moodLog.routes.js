const express = require('express')
const router = express.Router();
const moodLogController = require('../controller/moodLog.controller');
const getMoodLogs = require('../controller/moodLog.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/', authMiddleware.authUser, moodLogController.createMoodLog)
router.get('/', authMiddleware.authUser, moodLogController.getMoodLogs)
router.get('/stats', authMiddleware.authUser, moodLogController.getMoodStats)

module.exports = router;