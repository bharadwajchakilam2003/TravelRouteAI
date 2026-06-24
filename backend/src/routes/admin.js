const express = require('express');
const router = express.Router();
const { getDashboard, getUsers, deleteUser, getSearches, getAllTrips } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(protect, admin);
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/searches', getSearches);
router.get('/trips', getAllTrips);

module.exports = router;
