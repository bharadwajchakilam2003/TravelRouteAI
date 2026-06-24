const User = require('../models/User');
const Search = require('../models/Search');
const mapsService = require('../services/mapsService');
const costService = require('../services/costService');
const budgetService = require('../services/budgetService');
const airportService = require('../services/airportService');

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function getCacheKey(source, destination, travelers) {
  return `${source.toLowerCase()}|${destination.toLowerCase()}|${travelers}`;
}

function haversineRoute(src, dst) {
  const R = 6371;
  const dLat = (dst.lat - src.lat) * Math.PI / 180;
  const dLon = (dst.lng - src.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(src.lat * Math.PI / 180) * Math.cos(dst.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const numPoints = 20;
  const polyline = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const lat = src.lat + (dst.lat - src.lat) * f;
    const lng = src.lng + (dst.lng - src.lng) * f;
    polyline.push(`${lat},${lng}`);
  }
  return {
    distance: Math.round(distance),
    duration: Math.round(distance / 50 * 60),
    polyline: polyline.join(';'),
    alternativeRoutes: []
  };
}

exports.search = async (req, res) => {
  const startTime = Date.now();
  try {
    const { source, destination, travelDate, returnDate, travelers } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ success: false, message: 'Source and destination are required' });
    }

    const cacheKey = getCacheKey(source, destination, travelers);
    if (!travelDate && !returnDate) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return res.json({ ...cached.data, cached: true });
      }
    }

    const sourceCoords = await mapsService.geocode(source);
    const destCoords = await mapsService.geocode(destination);

    const route = haversineRoute(sourceCoords, destCoords);
    const srcCode = airportService.getAirportCode(source) || (source.length <= 3 ? source.slice(0, 3).toUpperCase() : null) || airportService.getNearestAirport(sourceCoords.lat, sourceCoords.lng);
    const destCode = airportService.getAirportCode(destination) || (destination.length <= 3 ? destination.slice(0, 3).toUpperCase() : null) || airportService.getNearestAirport(destCoords.lat, destCoords.lng);

    const d = route.distance || 0;
    const days = travelDate && returnDate
      ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(travelDate)) / 86400000) + 1)
      : 1;

    const carCost = costService.calculateCarCost(d);
    const busCost = costService.calculateBusCost(d);
    const trainCost = costService.calculateTrainCost(d, source, destination);
    const budget = budgetService.calculateBudget(d, travelers || 1);

    const flightCost = srcCode && destCode
      ? await costService.calculateFlightCost(srcCode, destCode, travelDate, d).catch(() => ({ flights: [] }))
      : { flights: [] };

    const costSummary = costService.getSummary(
      carCost || { fuelCost: 0, tollCharges: 0, parkingCharges: 0, totalCost: 0, duration: 0 },
      busCost || { governmentBus: { cost: 0, duration: 0 }, privateBus: { cost: 0, duration: 0 } },
      trainCost || { trains: [] },
      flightCost
    );

    const citiesOnRoute = [
      { name: source, lat: sourceCoords.lat, lng: sourceCoords.lng },
      { name: destination, lat: destCoords.lat, lng: destCoords.lng }
    ];

    try {
      const searchEntry = { source, destination, resultsFound: true, responseTime: Date.now() - startTime };
      if (req.user) {
        searchEntry.user = req.user._id;
        await Search.create(searchEntry).catch(() => {});
        await User.findByIdAndUpdate(req.user._id, {
          $push: { searchHistory: { source, destination, travelDate: travelDate || undefined, returnDate: returnDate || undefined, travelers: travelers || 1, searchedAt: new Date() } }
        }).catch(() => {});
      } else {
        await Search.create(searchEntry).catch(() => {});
      }
    } catch {}

    const result = {
      success: true,
      route,
      source: { name: source, ...sourceCoords },
      destination: { name: destination, ...destCoords },
      citiesOnRoute,
      attractions: [],
      weather: [],
      costEstimates: { car: carCost, bus: busCost, train: trainCost, flight: flightCost, summary: costSummary, budget },
      travelers: travelers || 1
    };

    if (!travelDate && !returnDate) {
      cache.set(cacheKey, { data: result, ts: Date.now() });
    }

    res.json(result);
  } catch (error) {
    console.error('Search error:', error.message);
    if (error.message.includes('geocode') || error.message.includes('Location not found')) {
      return res.status(400).json({ success: false, message: 'Invalid location. Please check your source and destination.' });
    }
    res.status(500).json({ success: false, message: error.message || 'Search failed. Please try again.' });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const searches = await Search.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, searches });
  } catch (error) {
    res.json({ success: true, searches: [] });
  }
};
