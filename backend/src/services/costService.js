const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/env');

const cache = new NodeCache({ stdTTL: 3600 });

const PETROL_PRICE_PER_LITRE = 110;
const AVERAGE_MILEAGE = 15;
const BUS_RATE_PER_KM = 2;
const TRAIN_RATES = { general: 0.75, sleeper: 1.2, ac3: 2.0, ac2: 2.8, ac1: 4.5 };

const costService = {
  calculateCarCost(distanceKm) {
    const fuelNeeded = distanceKm / AVERAGE_MILEAGE;
    const fuelCost = fuelNeeded * PETROL_PRICE_PER_LITRE;
    const tollCharges = distanceKm * 1.2 + 50;
    const parkingCharges = 200 + distanceKm * 0.5;
    return {
      fuelCost: Math.round(fuelCost),
      tollCharges: Math.round(tollCharges),
      parkingCharges: Math.round(parkingCharges),
      totalCost: Math.round(fuelCost + tollCharges + parkingCharges),
      duration: Math.round(distanceKm / 50),
      fuelPricePerLiter: PETROL_PRICE_PER_LITRE,
      mileage: AVERAGE_MILEAGE
    };
  },

  calculateBusCost(distanceKm) {
    return {
      governmentBus: {
        cost: Math.round(distanceKm * BUS_RATE_PER_KM * 0.75),
        duration: Math.round(distanceKm / 40),
        available: true,
        type: 'Government (APSRTC/TSRTC)'
      },
      privateBus: {
        cost: Math.round(distanceKm * BUS_RATE_PER_KM),
        duration: Math.round(distanceKm / 45),
        available: true,
        type: 'Private AC Sleeper'
      }
    };
  },

  calculateTrainCost(distanceKm, source, destination) {
    const trains = [
      {
        trainNumber: '',
        trainName: `${source} - ${destination} Express`,
        departureTime: '06:00',
        arrivalTime: this._addHours('06:00', distanceKm / 50),
        duration: this._formatDuration(distanceKm / 50),
        classes: [
          { name: 'General', fare: Math.round(distanceKm * TRAIN_RATES.general), available: true },
          { name: 'Sleeper', fare: Math.round(distanceKm * TRAIN_RATES.sleeper), available: true },
          { name: '3A', fare: Math.round(distanceKm * TRAIN_RATES.ac3), available: true },
          { name: '2A', fare: Math.round(distanceKm * TRAIN_RATES.ac2), available: true },
          { name: '1A', fare: Math.round(distanceKm * TRAIN_RATES.ac1), available: true }
        ]
      },
      {
        trainNumber: '',
        trainName: `${source} - ${destination} Superfast`,
        departureTime: '22:00',
        arrivalTime: this._addHours('22:00', distanceKm / 60),
        duration: this._formatDuration(distanceKm / 60),
        classes: [
          { name: 'Sleeper', fare: Math.round(distanceKm * TRAIN_RATES.sleeper * 1.1), available: true },
          { name: '3A', fare: Math.round(distanceKm * TRAIN_RATES.ac3 * 1.1), available: true },
          { name: '2A', fare: Math.round(distanceKm * TRAIN_RATES.ac2 * 1.1), available: true },
          { name: '1A', fare: Math.round(distanceKm * TRAIN_RATES.ac1 * 1.1), available: true }
        ]
      }
    ];
    return { trains };
  },

  _addHours(time, hours) {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + Math.round(hours * 60);
    const newH = Math.floor(totalMinutes / 60) % 24;
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  },

  _formatDuration(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  },

  async calculateFlightCost(sourceCode, destCode, date, distanceKm = 500) {
    const cacheKey = `flights_${sourceCode}_${destCode}_${date}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    try {
      if (config.amadeusClientId && config.amadeusClientSecret &&
          config.amadeusClientId !== 'your_amadeus_client_id') {
        const authRes = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
          `grant_type=client_credentials&client_id=${config.amadeusClientId}&client_secret=${config.amadeusClientSecret}`,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const token = authRes.data.access_token;
        const flightRes = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
          params: { originLocationCode: sourceCode, destinationLocationCode: destCode, departureDate: date, adults: 1, max: 5 },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
        if (flightRes.data.data && flightRes.data.data.length > 0) {
          const apiFlights = flightRes.data.data.map(f => ({
            airline: f.validatingAirlineCodes?.[0] || 'Unknown',
            flightNumber: f.itineraries?.[0]?.segments?.[0]?.carrierCode + '-' + f.itineraries?.[0]?.segments?.[0]?.number || 'N/A',
            departureTime: f.itineraries?.[0]?.segments?.[0]?.departure?.at?.slice(11, 16) || '00:00',
            arrivalTime: f.itineraries?.[0]?.segments?.[0]?.arrival?.at?.slice(11, 16) || '00:00',
            duration: f.itineraries?.[0]?.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || 'N/A',
            price: Math.round(parseFloat(f.price?.grandTotal || '0') * 80),
            cabinClass: f.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'Economy',
            stops: (f.itineraries?.[0]?.segments?.length || 1) - 1
          }));
          const result = { flights: apiFlights };
          cache.set(cacheKey, result);
          return result;
        }
      }
    } catch (error) {
      console.error('Amadeus API error:', error.message);
    }
    let flights = [];
    try {
      if (config.aviationstackKey && config.aviationstackKey !== 'your_aviationstack_key') {
        const avRes = await axios.get('http://api.aviationstack.com/v1/flights', {
          params: { access_key: config.aviationstackKey, dep_iata: sourceCode, arr_iata: destCode, limit: 5 },
          timeout: 8000
        });
        if (avRes.data?.data?.length > 0) {
          flights = avRes.data.data.map(f => ({
            airline: f.airline?.name || 'Unknown',
            flightNumber: f.flight?.iata || 'N/A',
            departureTime: f.departure?.scheduled?.slice(11, 16) || '00:00',
            arrivalTime: f.arrival?.scheduled?.slice(11, 16) || '00:00',
            duration: this._formatDuration(distanceKm / 750),
            price: Math.round(distanceKm * 6.5 * (0.8 + Math.random() * 0.6) + 1500),
            cabinClass: 'Economy',
            stops: 0
          }));
        }
      }
    } catch { flights = []; }
    if (flights.length === 0) {
      const baseFare = Math.round(distanceKm * 6.5 + 1500);
      flights = [
        { airline: 'IndiGo', flightNumber: '6E-101', departureTime: '06:30', arrivalTime: this._addHours('06:30', distanceKm / 750), duration: this._formatDuration(distanceKm / 750), price: Math.round(baseFare * 0.85), cabinClass: 'Economy', stops: 0 },
        { airline: 'SpiceJet', flightNumber: 'SG-205', departureTime: '09:00', arrivalTime: this._addHours('09:00', distanceKm / 750), duration: this._formatDuration(distanceKm / 750), price: Math.round(baseFare * 0.8), cabinClass: 'Economy', stops: 0 },
        { airline: 'Air India', flightNumber: 'AI-303', departureTime: '14:00', arrivalTime: this._addHours('14:00', distanceKm / 800), duration: this._formatDuration(distanceKm / 800), price: Math.round(baseFare * 1.2), cabinClass: 'Economy', stops: 0 },
        { airline: 'Vistara', flightNumber: 'UK-404', departureTime: '16:30', arrivalTime: this._addHours('16:30', distanceKm / 800), duration: this._formatDuration(distanceKm / 800), price: Math.round(baseFare * 1.4), cabinClass: 'Premium Economy', stops: 0 }
      ];
    }
    const result = { flights };
    cache.set(cacheKey, result);
    return result;
  },

  getSummary(carCost, busCost, trainCost, flightCost) {
    const options = [
      { mode: 'Car', cost: carCost?.totalCost || 0, time: carCost?.duration || 0, type: 'car' },
      { mode: 'Bus', cost: busCost?.governmentBus?.cost || 0, time: busCost?.governmentBus?.duration || 0, type: 'bus' },
      { mode: 'Train', cost: trainCost?.trains?.[0]?.classes?.[2]?.fare || 0, time: parseInt(trainCost?.trains?.[0]?.duration) || 0, type: 'train' },
      { mode: 'Flight', cost: flightCost?.flights?.[0]?.price || 0, time: 2, type: 'flight' }
    ];
    const bestValue = [...options].sort((a, b) => a.cost - b.cost)[0];
    const fastest = [...options].sort((a, b) => a.time - b.time)[0];
    return { options, bestValue, fastest };
  }
};

module.exports = costService;
