const weatherService = require('../services/weatherService');

exports.getWeather = async (req, res) => {
  try {
    const { lat, lng, days } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }
    const [current, forecast, alerts] = await Promise.all([
      weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lng)),
      weatherService.getForecast(parseFloat(lat), parseFloat(lng), parseInt(days) || 7),
      weatherService.getWeatherAlerts(parseFloat(lat), parseFloat(lng))
    ]);
    res.json({ success: true, current, forecast, alerts });
  } catch (error) {
    console.error('Weather controller error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch weather data' });
  }
};
