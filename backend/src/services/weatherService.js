const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 1800 });

const weatherService = {
  async getCurrentWeather(lat, lng) {
    const cacheKey = `current_weather_${lat}_${lng}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    try {
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lng,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index',
          daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
          timezone: 'auto',
          forecast_days: 1
        }
      });
      const wmoCodes = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
        80: 'Slight Rain Showers', 81: 'Moderate Rain Showers', 82: 'Violent Rain Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
      };
      const c = data.current;
      const d = data.daily;
      const condition = wmoCodes[c.weather_code] || 'Unknown';
      const result = {
        temperature: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: c.relative_humidity_2m,
        pressure: c.surface_pressure ? Math.round(c.surface_pressure) : 1013,
        windSpeed: Math.round(c.wind_speed_10m),
        windDeg: c.wind_direction_10m || 0,
        condition,
        description: condition,
        icon: `https://open-meteo.com/images/weather-icons/${String(c.weather_code).padStart(2, '0')}.png`,
        clouds: 0,
        visibility: 10000,
        sunrise: d?.sunrise?.[0] || 0,
        sunset: d?.sunset?.[0] || 0,
        rainProbability: d?.precipitation_probability_max?.[0] || 0,
        uvIndex: c.uv_index || 0
      };
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Open-Meteo current weather error:', error.message);
      return {
        temperature: 25, feelsLike: 27, humidity: 60, pressure: 1013,
        windSpeed: 10, windDeg: 0, condition: 'Clear', description: 'clear sky',
        icon: 'https://open-meteo.com/images/weather-icons/00.png', clouds: 0, visibility: 10000,
        sunrise: 0, sunset: 0, rainProbability: 0, uvIndex: 0
      };
    }
  },

  async getForecast(lat, lng, days = 7) {
    const cacheKey = `forecast_${lat}_${lng}_${days}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    try {
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lng,
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,weather_code,sunrise,sunset,uv_index_max',
          hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m',
          timezone: 'auto',
          forecast_days: days
        }
      });
      const wmoCodes = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
        80: 'Slight Rain Showers', 81: 'Moderate Rain Showers', 82: 'Violent Rain Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
      };
      const daily = data.daily;
      const hourly = data.hourly;
      const result = daily.time.map((date, i) => {
        const dayHourly = [];
        if (hourly) {
          for (let h = i * 24; h < (i + 1) * 24 && h < (hourly.time || []).length; h++) {
            if (hourly.time[h]) {
              dayHourly.push({
                time: hourly.time[h].split('T')[1]?.slice(0, 5) || '00:00',
                temperature: Math.round(hourly.temperature_2m[h]),
                humidity: hourly.relative_humidity_2m[h],
                windSpeed: Math.round(hourly.wind_speed_10m[h]),
                condition: wmoCodes[hourly.weather_code[h]] || 'Unknown',
                icon: `https://open-meteo.com/images/weather-icons/${String(hourly.weather_code[h]).padStart(2, '0')}.png`,
                rainProbability: hourly.precipitation_probability[h] || 0
              });
            }
          }
        }
        const wc = daily.weather_code[i];
        return {
          date,
          tempMin: Math.round(daily.temperature_2m_min[i]),
          tempMax: Math.round(daily.temperature_2m_max[i]),
          humidity: 0,
          windSpeed: Math.round(daily.wind_speed_10m_max[i]),
          condition: wmoCodes[wc] || 'Unknown',
          description: wmoCodes[wc] || 'Unknown',
          icon: `https://open-meteo.com/images/weather-icons/${String(wc).padStart(2, '0')}.png`,
          rainProbability: daily.precipitation_probability_max[i] || 0,
          sunrise: daily.sunrise[i],
          sunset: daily.sunset[i],
          uvIndex: daily.uv_index_max[i] || 0,
          precipitation: daily.precipitation_sum[i] || 0,
          hourly: dayHourly
        };
      });
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Open-Meteo forecast error:', error.message);
      return [];
    }
  },

  async getWeatherAlerts(lat, lng) {
    try {
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat, longitude: lng,
          daily: 'precipitation_sum,wind_speed_10m_max,temperature_2m_max',
          timezone: 'auto',
          forecast_days: 3
        }
      });
      const alerts = [];
      if (data.daily) {
        for (let i = 0; i < (data.daily.time || []).length; i++) {
          if (data.daily.precipitation_sum[i] > 50) {
            alerts.push({ event: 'Heavy Rain', start: data.daily.time[i], end: data.daily.time[i], description: `Expected ${data.daily.precipitation_sum[i]}mm of rain`, senderName: 'Open-Meteo' });
          }
          if (data.daily.wind_speed_10m_max[i] > 60) {
            alerts.push({ event: 'High Winds', start: data.daily.time[i], end: data.daily.time[i], description: `Wind speed up to ${data.daily.wind_speed_10m_max[i]} km/h`, senderName: 'Open-Meteo' });
          }
        }
      }
      return alerts;
    } catch {
      return [];
    }
  }
};

module.exports = weatherService;
