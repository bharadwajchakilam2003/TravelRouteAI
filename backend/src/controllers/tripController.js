const Trip = require('../models/Trip');

exports.saveTrip = async (req, res) => {
  try {
    const tripData = { ...req.body, user: req.user._id };
    const trip = await Trip.create(tripData);
    await req.user.populate('savedTrips');
    req.user.savedTrips.push(trip._id);
    await req.user.save();
    res.status(201).json({ success: true, trip });
  } catch (error) {
    console.error('Save trip error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to save trip' });
  }
};

exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, trips });
  } catch (error) {
    console.error('Get trips error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch trips' });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    console.error('Get trip error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch trip' });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, trip: updatedTrip });
  } catch (error) {
    console.error('Update trip error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update trip' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Trip.findByIdAndDelete(req.params.id);
    req.user.savedTrips = req.user.savedTrips.filter(t => t.toString() !== req.params.id);
    await req.user.save();
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete trip' });
  }
};
