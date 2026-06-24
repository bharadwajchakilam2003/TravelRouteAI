const express = require('express');
const router = express.Router();
const { getAttractions, getNearbyPlaces, getPlaceDetails, getCitiesOnRoute, getFamousIndianPlaces } = require('../controllers/placesController');

router.get('/attractions', getAttractions);
router.get('/nearby', getNearbyPlaces);
router.get('/details/:placeId', getPlaceDetails);
router.get('/cities-on-route', getCitiesOnRoute);
router.get('/famous-indian-places', getFamousIndianPlaces);

module.exports = router;
