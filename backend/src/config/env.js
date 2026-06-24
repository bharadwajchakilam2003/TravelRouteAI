const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/travelroute_ai',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  openrouteApiKey: process.env.OPENROUTE_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  aviationstackKey: process.env.AVIATIONSTACK_API_KEY,
  opentripmapKey: process.env.OPENTRIPMAP_API_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
