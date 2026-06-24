const User = require('../models/User');
const Search = require('../models/Search');
const mapsService = require('../services/mapsService');
const weatherService = require('../services/weatherService');
const placesService = require('../services/placesService');
const costService = require('../services/costService');
const budgetService = require('../services/budgetService');
const airportService = require('../services/airportService');

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function getCacheKey(source, destination, travelers) {
  return `${source.toLowerCase()}|${destination.toLowerCase()}|${travelers}`;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
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

    const [sourceCoords, destCoords] = await Promise.all([
      withTimeout(mapsService.geocode(source), 4000),
      withTimeout(mapsService.geocode(destination), 4000)
    ]);

    const [route, srcCode, destCode] = await Promise.all([
      withTimeout(mapsService.getRoute(sourceCoords, destCoords), 6000),
      withTimeout(
        Promise.resolve(
          airportService.getAirportCode(source)
          || (source.length <= 3 ? source.slice(0, 3).toUpperCase() : null)
          || airportService.getNearestAirport(sourceCoords.lat, sourceCoords.lng)
        ), 3000
      ).catch(() => null),
      withTimeout(
        Promise.resolve(
          airportService.getAirportCode(destination)
          || (destination.length <= 3 ? destination.slice(0, 3).toUpperCase() : null)
          || airportService.getNearestAirport(destCoords.lat, destCoords.lng)
        ), 3000
      ).catch(() => null)
    ]);

    const d = route?.distance || 0;
    const days = travelDate && returnDate
      ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(travelDate)) / 86400000) + 1)
      : 1;

    const [destAttractions, weatherResult, carCost, busCost, trainCost, budget] = await Promise.all([
      withTimeout(
        placesService.getAttractions(destCoords.lat, destCoords.lng, 50000, destination)
          .then(a => a.map(at => ({ ...at, city: destination })))
          .catch(() => []),
        5000
      ),
      withTimeout(
        weatherService.getForecast(destCoords.lat, destCoords.lng, days)
          .then(f => ([{ city: destination, forecast: f }]))
          .catch(() => []),
        4000
      ),
      withTimeout(Promise.resolve(costService.calculateCarCost(d)), 2500).catch(() => null),
      withTimeout(Promise.resolve(costService.calculateBusCost(d)), 2500).catch(() => null),
      withTimeout(Promise.resolve(costService.calculateTrainCost(d, source, destination)), 4000).catch(() => null),
      withTimeout(Promise.resolve(budgetService.calculateBudget(d, travelers || 1)), 2500).catch(() => null)
    ]);

    const flightCost = srcCode && destCode
      ? await withTimeout(
          Promise.resolve(costService.calculateFlightCost(srcCode, destCode, travelDate, d)),
          4000
        ).catch(() => ({ flights: [] }))
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
      attractions: (destAttractions || []).slice(0, 30),
      weather: weatherResult || [],
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
