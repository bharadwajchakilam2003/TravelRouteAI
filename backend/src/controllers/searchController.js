const User = require('../models/User');
const Search = require('../models/Search');
const mapsService = require('../services/mapsService');
const weatherService = require('../services/weatherService');
const placesService = require('../services/placesService');
const costService = require('../services/costService');
const budgetService = require('../services/budgetService');
const airportService = require('../services/airportService');

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function getCacheKey(source, destination, travelers) {
  return `${source.toLowerCase()}|${destination.toLowerCase()}|${travelers}`;
}

function withTimeout(promise, ms = 8000) {
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
      withTimeout(mapsService.geocode(source), 5000),
      withTimeout(mapsService.geocode(destination), 5000)
    ]);
    const route = await withTimeout(mapsService.getRoute(sourceCoords, destCoords), 8000);
    const rawCities = await withTimeout(placesService.findCitiesOnRoute(sourceCoords.lat, sourceCoords.lng, destCoords.lat, destCoords.lng), 6000);
    const cityNames = [source, ...(rawCities || []).filter(Boolean), destination];
    const uniqueNames = [...new Set(cityNames.map(c => c.toLowerCase()))];
    const citiesWithCoords = (await Promise.all(
      uniqueNames.slice(0, 7).map(async name => {
        try {
          const coords = await withTimeout(mapsService.geocode(name), 4000);
          return { name, lat: coords.lat, lng: coords.lng };
        } catch { return null; }
      })
    )).filter(Boolean);
    const days = (() => {
      if (travelDate && returnDate) {
        const d1 = new Date(travelDate), d2 = new Date(returnDate);
        return Math.max(1, Math.ceil((d2 - d1) / 86400000) + 1);
      }
      return 1;
    })();
    const [attractionsResults, weatherResults, carCost, busCost, trainCost] = await Promise.all([
      Promise.all(citiesWithCoords.slice(0, 3).map(c =>
        withTimeout(placesService.getAttractions(c.lat, c.lng, 50000, c.name).then(a => ({ city: c.name, attractions: a })).catch(() => ({ city: c.name, attractions: [] })), 7000)
      )),
      Promise.all(citiesWithCoords.slice(0, 4).map(c =>
        withTimeout(weatherService.getForecast(c.lat, c.lng, days).then(f => ({
          city: c.name, forecast: f,
          ...(c.name.toLowerCase() === destination.toLowerCase() ? weatherService.getCurrentWeather(c.lat, c.lng).catch(() => ({})) : {})
        })).catch(() => ({ city: c.name, forecast: [] })), 6000)
      )),
      withTimeout(costService.calculateCarCost(route.distance).catch(() => ({ fuelCost: 0, tollCharges: 0, parkingCharges: 0, totalCost: 0, duration: 0 })), 3000),
      withTimeout(costService.calculateBusCost(route.distance).catch(() => ({ governmentBus: { cost: 0, duration: 0 }, privateBus: { cost: 0, duration: 0 } })), 3000),
      withTimeout(costService.calculateTrainCost(route.distance, source, destination).catch(() => ({ trains: [] })), 5000)
    ]);
    let flightCost = { flights: [] };
    try {
      const srcCode = await withTimeout(airportService.getAirportCode(source) || (source.length <= 3 ? source.slice(0, 3).toUpperCase() : null) || airportService.getNearestAirport(sourceCoords.lat, sourceCoords.lng), 3000);
      const destCode = await withTimeout(airportService.getAirportCode(destination) || (destination.length <= 3 ? destination.slice(0, 3).toUpperCase() : null) || airportService.getNearestAirport(destCoords.lat, destCoords.lng), 3000);
      if (srcCode && destCode) {
        flightCost = await withTimeout(costService.calculateFlightCost(srcCode, destCode, travelDate, route.distance).catch(() => ({ flights: [] })), 5000);
      }
    } catch { flightCost = { flights: [] }; }
    const costSummary = costService.getSummary(carCost, busCost, trainCost, flightCost);
    const budget = await withTimeout(budgetService.calculateBudget(route.distance, travelers || 1).catch(() => null), 3000);
    const allAttractions = (attractionsResults || []).flatMap(r =>
      r?.attractions?.map(a => ({ ...a, city: r.city })) || []
    ).slice(0, 30);
    try {
      if (req.user) {
        await Search.create({
          user: req.user._id, source, destination,
          travelDate: travelDate || undefined, returnDate: returnDate || undefined,
          travelers: travelers || 1, resultsFound: true, responseTime: Date.now() - startTime
        }).catch(() => {});
        await User.findByIdAndUpdate(req.user._id, {
          $push: { searchHistory: { source, destination, travelDate: travelDate || undefined, returnDate: returnDate || undefined, travelers: travelers || 1, searchedAt: new Date() } }
        }).catch(() => {});
      } else {
        await Search.create({ source, destination, resultsFound: true, responseTime: Date.now() - startTime }).catch(() => {});
    }
    try {} catch {} // DB unavailable – continue without logging
    const result = {
      success: true,
      route,
      source: { name: source, ...sourceCoords },
      destination: { name: destination, ...destCoords },
      citiesOnRoute: citiesWithCoords,
      attractions: allAttractions,
      weather: weatherResults,
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

