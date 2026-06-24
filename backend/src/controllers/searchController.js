const User = require('../models/User');
const Search = require('../models/Search');
const mapsService = require('../services/mapsService');
const weatherService = require('../services/weatherService');
const placesService = require('../services/placesService');
const costService = require('../services/costService');
const budgetService = require('../services/budgetService');
const airportService = require('../services/airportService');

exports.search = async (req, res) => {
  const startTime = Date.now();
  try {
    const { source, destination, travelDate, returnDate, travelers } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ success: false, message: 'Source and destination are required' });
    }
    const sourceCoords = await mapsService.geocode(source);
    const destCoords = await mapsService.geocode(destination);
    const route = await mapsService.getRoute(sourceCoords, destCoords);
    const citiesOnRoute = await placesService.findCitiesOnRoute(sourceCoords.lat, sourceCoords.lng, destCoords.lat, destCoords.lng);
    const allLocations = [
      { name: source, lat: sourceCoords.lat, lng: sourceCoords.lng },
      ...citiesOnRoute.filter(Boolean).map(c => ({ name: c, lat: 0, lng: 0 })),
      { name: destination, lat: destCoords.lat, lng: destCoords.lng }
    ];
    const uniqueCities = [];
    const seen = new Set();
    for (const loc of allLocations) {
      if (loc.name && !seen.has(loc.name.toLowerCase())) {
        seen.add(loc.name.toLowerCase());
        if (loc.lat === 0) {
          try {
            const coords = await mapsService.geocode(loc.name);
            loc.lat = coords.lat;
            loc.lng = coords.lng;
          } catch { continue; }
        }
        uniqueCities.push(loc);
      }
    }
    const citiesWithCoords = uniqueCities.filter(c => c.lat && c.lng);
    const days = (() => {
      if (travelDate && returnDate) {
        const d1 = new Date(travelDate), d2 = new Date(returnDate);
        return Math.max(1, Math.ceil((d2 - d1) / 86400000) + 1);
      }
      return 1;
    })();
    const [attractionsResults, weatherResults, carCost, busCost, trainCost] = await Promise.all([
      Promise.all(citiesWithCoords.slice(0, 5).map(c =>
        placesService.getAttractions(c.lat, c.lng, 50000, c.name).then(a => ({ city: c.name, attractions: a })).catch(() => ({ city: c.name, attractions: [] }))
      )),
      Promise.all(citiesWithCoords.map(c =>
        weatherService.getForecast(c.lat, c.lng, days).then(f => ({
          city: c.name, forecast: f,
          ...(c.name.toLowerCase() === destination.toLowerCase() ? weatherService.getCurrentWeather(c.lat, c.lng).catch(() => ({})) : {})
        })).catch(() => ({ city: c.name, forecast: [] }))
      )),
      Promise.resolve(costService.calculateCarCost(route.distance)).catch(() => ({ fuelCost: 0, tollCharges: 0, parkingCharges: 0, totalCost: 0, duration: 0 })),
      Promise.resolve(costService.calculateBusCost(route.distance)).catch(() => ({ governmentBus: { cost: 0, duration: 0 }, privateBus: { cost: 0, duration: 0 } })),
      Promise.resolve(costService.calculateTrainCost(route.distance, source, destination)).catch(() => ({ trains: [] }))
    ]);
    let flightCost = { flights: [] };
    try {
      const srcCode = airportService.getAirportCode(source) || (source.length <= 3 ? source.slice(0, 3).toUpperCase() : null) || airportService.getNearestAirport(sourceCoords.lat, sourceCoords.lng);
      const destCode = airportService.getAirportCode(destination) || (destination.length <= 3 ? destination.slice(0, 3).toUpperCase() : null) || airportService.getNearestAirport(destCoords.lat, destCoords.lng);
      if (srcCode && destCode) {
        flightCost = await costService.calculateFlightCost(srcCode, destCode, travelDate, route.distance);
      }
    } catch { flightCost = { flights: [] }; }
    const costSummary = costService.getSummary(carCost, busCost, trainCost, flightCost);
    const budget = await budgetService.calculateBudget(route.distance, travelers || 1).catch(() => null);
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
    } catch {} // DB unavailable – continue without logging
    res.json({
      success: true,
      route,
      source: { name: source, ...sourceCoords },
      destination: { name: destination, ...destCoords },
      citiesOnRoute: citiesWithCoords,
      attractions: allAttractions,
      weather: weatherResults,
      costEstimates: { car: carCost, bus: busCost, train: trainCost, flight: flightCost, summary: costSummary, budget },
      travelers: travelers || 1
    });
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

