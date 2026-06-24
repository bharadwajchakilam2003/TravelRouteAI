const User = require('../models/User');
const Trip = require('../models/Trip');
const Search = require('../models/Search');

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalTrips, totalSearches, recentSearches, popularRoutes] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Search.countDocuments(),
      Search.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
      Search.aggregate([
        { $group: { _id: { source: '$source', destination: '$destination' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);
    res.json({
      success: true,
      stats: { totalUsers, totalTrips, totalSearches },
      recentSearches,
      popularRoutes: popularRoutes.map(r => ({ source: r._id.source, destination: r._id.destination, count: r.count }))
    });
  } catch (error) {
    console.error('Admin dashboard error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password');
    const total = await User.countDocuments();
    res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await Trip.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSearches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const searches = await Search.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email');
    const total = await Search.countDocuments();
    res.json({ success: true, searches, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get searches error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllTrips = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const trips = await Trip.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email');
    const total = await Trip.countDocuments();
    res.json({ success: true, trips, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Get all trips error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
