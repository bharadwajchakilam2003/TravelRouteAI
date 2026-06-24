const express = require('express');
const router = express.Router();
const { chat, clearHistory } = require('../controllers/aiController');

router.post('/chat', chat);
router.post('/clear', clearHistory);

module.exports = router;
