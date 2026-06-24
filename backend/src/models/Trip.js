const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My Trip'
  },
  source: {
    name: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    name: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  travelDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  travelers: {
    type: Number,
    default: 1,
    min: 1
  },
  route: {
    distance: Number,
    duration: Number,
    polyline: String,
    alternativeRoutes: [{
      distance: Number,
      duration: Number,
      polyline: String,
      summary: String
    }]
  },
  attractions: [{
    placeId: String,
    name: String,
    description: String,
    image: String,
    rating: Number,
    lat: Number,
    lng: Number,
    timeRequired: String,
    entryFee: String,
    bestTimeToVisit: String,
    category: String
  }],
  weather: [{
    city: String,
    date: Date,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    rainProbability: Number,
    uvIndex: Number,
    condition: String,
    icon: String
  }],
  costEstimate: {
    car: {
      fuelCost: Number,
      tollCharges: Number,
      parkingCharges: Number,
      totalCost: Number,
      duration: Number
    },
    bus: {
      governmentBus: { cost: Number, duration: Number, available: Boolean },
      privateBus: { cost: Number, duration: Number, available: Boolean }
    },
    train: {
      trains: [{
        trainNumber: String,
        trainName: String,
        departureTime: String,
        arrivalTime: String,
        duration: String,
        classes: [{
          name: String,
          fare: Number,
          available: Boolean
        }]
      }]
    },
    flight: {
      flights: [{
        airline: String,
        flightNumber: String,
        departureTime: String,
        arrivalTime: String,
        duration: String,
        price: Number,
        cabinClass: String,
        stops: Number
      }]
    }
  },
  hotels: [{
    placeId: String,
    name: String,
    image: String,
    price: Number,
    rating: Number,
    amenities: [String],
    lat: Number,
    lng: Number,
    category: String
  }],
  restaurants: [{
    placeId: String,
    name: String,
    rating: Number,
    cuisine: String,
    costForTwo: Number,
    image: String,
    lat: Number,
    lng: Number
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ 'source.name': 'text', 'destination.name': 'text' });

module.exports = mongoose.model('Trip', tripSchema);
