const express = require('express');
const router = express.Router();
const { saveTrip, getMyTrips, getTripById, updateTrip, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyTrips);
router.post('/', protect, saveTrip);
router.get('/:id', protect, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
