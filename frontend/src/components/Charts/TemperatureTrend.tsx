import { motion } from 'framer-motion';

interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon?: string;
  rainProbability?: number;
}

interface TemperatureTrendProps {
  forecast: ForecastDay[];
  city: string;
}

export default function TemperatureTrend({ forecast, city }: TemperatureTrendProps) {
  if (!forecast || forecast.length < 2) return null;

  const allTemps = forecast.flatMap(d => [d.tempMax, d.tempMin]);
  const minY = Math.min(...allTemps) - 3;
  const maxY = Math.max(...allTemps) + 3;
  const range = maxY - minY || 1;

  const W = 600, H = 220, PAD = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xScale = (i: number) => PAD.left + (i / (forecast.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - ((v - minY) / range) * chartH;

  const highPoints = forecast.map((d, i) => `${xScale(i)},${yScale(d.tempMax)}`).join(' ');
  const lowPoints = forecast.map((d, i) => `${xScale(i)},${yScale(d.tempMin)}`).join(' ');

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🌡️</span> Temperature Trend — {city}
      </h3>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const y = yScale(minY + range * f);
          const val = Math.round(minY + range * f);
          return (
            <g key={f}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="text-gray-400 text-[10px] fill-current">{val}°</text>
            </g>
          );
        })}

        {/* Low temp area fill */}
        <path
          d={`M${lowPoints} L${highPoints.split(' ').reverse().join(' ')} Z`}
          fill="url(#tempGrad)"
          opacity="0.15"
        />

        {/* High temp line */}
        <polyline points={highPoints} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Low temp line */}
        <polyline points={lowPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Data dots + labels */}
        {forecast.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d.tempMax)} r="4" fill="#ef4444" className="drop-shadow-sm" />
            <text x={xScale(i)} y={yScale(d.tempMax) - 10} textAnchor="middle" className="text-[10px] fill-red-500 font-medium">
              {d.tempMax}°
            </text>
            <circle cx={xScale(i)} cy={yScale(d.tempMin)} r="4" fill="#3b82f6" className="drop-shadow-sm" />
            <text x={xScale(i)} y={yScale(d.tempMin) + 18} textAnchor="middle" className="text-[10px] fill-blue-500 font-medium">
              {d.tempMin}°
            </text>

            {/* X-axis labels */}
            <text x={xScale(i)} y={H - 8} textAnchor="middle" className="text-[9px] fill-gray-400">{getDayLabel(d.date)}</text>
          </g>
        ))}

        <defs>
          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Legend */}
        <line x1={W - 130} y1={12} x2={W - 110} y2={12} stroke="#ef4444" strokeWidth="2.5" />
        <text x={W - 105} y={15} className="text-[10px] fill-gray-500">High</text>
        <line x1={W - 70} y1={12} x2={W - 50} y2={12} stroke="#3b82f6" strokeWidth="2.5" />
        <text x={W - 45} y={15} className="text-[10px] fill-gray-500">Low</text>
      </svg>
    </motion.div>
  );
}