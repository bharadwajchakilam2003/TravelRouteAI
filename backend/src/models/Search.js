const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  travelDate: Date,
  returnDate: Date,
  travelers: {
    type: Number,
    default: 1
  },
  resultsFound: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  userAgent: String,
  responseTime: Number
}, {
  timestamps: true
});

searchSchema.index({ createdAt: -1 });
searchSchema.index({ source: 1, destination: 1 });

module.exports = mongoose.model('Search', searchSchema);
