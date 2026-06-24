const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const searchRoutes = require('./routes/search');
const weatherRoutes = require('./routes/weather');
const placesRoutes = require('./routes/places');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const cultureRoutes = require('./routes/culture');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TravelRoute AI API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/culture', cultureRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = config.port;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  });
}

module.exports = app;
