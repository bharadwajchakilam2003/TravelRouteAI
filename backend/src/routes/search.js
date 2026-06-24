const express = require('express');
const router = express.Router();
const { search, getSearchHistory } = require('../controllers/searchController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, search);
router.get('/history', protect, getSearchHistory);

module.exports = router;
