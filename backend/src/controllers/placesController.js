const placesService = require('../services/placesService');
const mapsService = require('../services/mapsService');
const bharatHeritageService = require('../services/indianHeritageService');

exports.getAttractions = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }
    const attractions = await placesService.getAttractions(parseFloat(lat), parseFloat(lng), parseInt(radius) || 100000);
    res.json({ success: true, attractions });
  } catch (error) {
    console.error('Places controller error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch attractions' });
  }
};

exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, type, radius } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }
    const places = await mapsService.findNearbyPlaces(parseFloat(lat), parseFloat(lng), parseInt(radius) || 5000, type || 'tourist_attraction');
    res.json({ success: true, places });
  } catch (error) {
    console.error('Nearby places error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch nearby places' });
  }
};

exports.getPlaceDetails = async (req, res) => {
  try {
    const { placeId } = req.params;
    if (!placeId) {
      return res.status(400).json({ success: false, message: 'Place ID is required' });
    }
    const details = await mapsService.getPlaceDetails(placeId);
    res.json({ success: true, details });
  } catch (error) {
    console.error('Place details error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch place details' });
  }
};

exports.getFamousIndianPlaces = async (req, res) => {
  try {
    const { search } = req.query;
    let places;
    if (search) {
      places = await bharatHeritageService.searchFamousPlaces(search);
    } else {
      places = await bharatHeritageService.getAllFamousPlaces();
    }
    res.json({ success: true, places });
  } catch (error) {
    console.error('Famous places error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch famous places' });
  }
};

exports.getCitiesOnRoute = async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng } = req.query;
    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({ success: false, message: 'Source and destination coordinates are required' });
    }
    const cities = await placesService.findCitiesOnRoute(parseFloat(sourceLat), parseFloat(sourceLng), parseFloat(destLat), parseFloat(destLng));
    res.json({ success: true, cities });
  } catch (error) {
    console.error('Cities on route error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch cities on route' });
  }
};
