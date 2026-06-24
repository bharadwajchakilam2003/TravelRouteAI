const express = require('express');
const router = express.Router();
const cultureController = require('../controllers/cultureController');

router.get('/states', cultureController.getAllStates);
router.get('/states/:id', cultureController.getStateDetail);
router.get('/search', cultureController.searchCulture);

module.exports = router;
