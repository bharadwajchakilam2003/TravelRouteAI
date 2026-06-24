import { motion } from 'framer-motion';
import { useState } from 'react';

interface WeatherData {
  city: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  condition?: string;
  icon?: string;
  description?: string;
  forecast?: Array<{
    date: string;
    tempMin: number;
    tempMax: number;
    condition: string;
    icon: string;
    rainProbability: number;
    windSpeed: number;
    humidity: number;
  }>;
}

interface WeatherSectionProps {
  weather: WeatherData[];
}

function CurrentWeather({ w }: { w: WeatherData }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-800 dark:text-white">{w.city}</h3>
      {w.icon && <img src={w.icon} alt={w.condition} className="w-10 h-10" />}
    </div>
  );
}

function ForecastCard({ day, index }: { day: NonNullable<WeatherData['forecast']>[0]; index: number }) {
  const date = new Date(day.date);
  const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="glass-card p-3 text-center card-hover"
    >
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{dayName}</div>
      <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">{dateStr}</div>
      {day.icon && <img src={day.icon} alt="" className="w-8 h-8 mx-auto mb-1" />}
      <div className="text-xs capitalize text-gray-500 dark:text-gray-400 mb-1 truncate">{day.condition}</div>
      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="font-bold text-gray-800 dark:text-white">{day.tempMax}°</span>
        <span className="text-gray-400 dark:text-gray-500">/ {day.tempMin}°</span>
      </div>
      <div className="flex justify-center gap-2 mt-1 text-[10px] text-gray-400 dark:text-gray-500">
        <span>💧 {day.humidity || 0}%</span>
        <span>💨 {day.windSpeed} km/h</span>
      </div>
      {day.rainProbability > 0 && (
        <div className="text-[10px] text-blue-500 mt-1">🌧️ {day.rainProbability}%</div>
      )}
    </motion.div>
  );
}

export default function WeatherSection({ weather }: WeatherSectionProps) {
  const [showForecast, setShowForecast] = useState(true);

  if (!weather || weather.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400 dark:text-gray-500">Weather data unavailable for this route.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="section-title">🌤️ Weather Forecast</h2>

      {weather.map((w, i) => (
        <div key={i}>
          {w.temperature !== undefined && (
            <div className="glass-card p-5 mb-4">
              <CurrentWeather w={w} />
              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{Math.round(w.temperature!)}°C</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 capitalize">{w.description || w.condition}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                  <div className="text-xs text-gray-400 dark:text-gray-500">💧 Humidity</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">{w.humidity}%</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                  <div className="text-xs text-gray-400 dark:text-gray-500">💨 Wind</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">{Math.round(w.windSpeed!)} km/h</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                  <div className="text-xs text-gray-400 dark:text-gray-500">🌡️ Feels</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200">{Math.round(w.temperature! - 2)}°C</div>
                </div>
              </div>
            </div>
          )}

          {w.forecast && w.forecast.length > 0 && (
            <>
              <button
                onClick={() => setShowForecast(!showForecast)}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-3 font-medium"
              >
                {showForecast ? '▼' : '▶'} {w.forecast.length}-Day Forecast
              </button>
              {showForecast && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {w.forecast.map((day, j) => (
                    <ForecastCard key={j} day={day} index={j} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </motion.div>
  );
}
