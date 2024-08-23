const express = require('express');
const { getAllLogs } = require('../controllers/actionLogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllLogs);

module.exports = router;
