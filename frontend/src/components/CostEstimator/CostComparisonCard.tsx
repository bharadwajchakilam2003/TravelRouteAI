import { motion } from 'framer-motion';
import { formatCurrency, formatDuration } from '../../utils/helpers';

interface SummaryOption {
  mode: string;
  cost: number;
  time: number;
  type: string;
}

interface CostComparisonCardProps {
  summary: {
    options: SummaryOption[];
    bestValue: SummaryOption;
    fastest: SummaryOption;
  };
  travelers: number;
}

const modeIcons: Record<string, string> = {
  Car: '🚗',
  Bus: '🚌',
  Train: '🚆',
  Flight: '✈️',
};

export default function CostComparisonCard({ summary, travelers }: CostComparisonCardProps) {
  if (!summary || !summary.options) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title mb-0">📊 Cost Comparison</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
          👥 {travelers} traveler{travelers > 1 ? 's' : ''}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 px-3 text-gray-500 dark:text-gray-400 font-medium">Mode</th>
              <th className="text-right py-4 px-3 text-gray-500 dark:text-gray-400 font-medium">Per Person</th>
              <th className="text-right py-4 px-3 text-gray-500 dark:text-gray-400 font-medium">Total</th>
              <th className="text-right py-4 px-3 text-gray-500 dark:text-gray-400 font-medium">Time</th>
              <th className="text-center py-4 px-3 text-gray-500 dark:text-gray-400 font-medium">Best For</th>
            </tr>
          </thead>
          <tbody>
            {summary.options.map((option, i) => {
              const isBestValue = summary.bestValue?.type === option.type;
              const isFastest = summary.fastest?.type === option.type;
              const perPerson = option.mode === 'Car'
                ? Math.round(option.cost / travelers)
                : option.cost;
              const total = option.mode === 'Car'
                ? option.cost
                : option.cost * travelers;
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    isBestValue || isFastest ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{modeIcons[option.mode] || '🚗'}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">{option.mode}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="font-semibold text-gray-800 dark:text-white">{formatCurrency(perPerson)}</span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                  </td>
                  <td className="py-4 px-3 text-right text-gray-500 dark:text-gray-400">
                    {option.time > 0 ? `${option.time}h` : 'N/A'}
                    {option.time > 0 && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">({formatDuration(option.time * 60)})</span>}
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {isBestValue && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                          👍 Best Value
                        </span>
                      )}
                      {isFastest && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full flex items-center gap-1">
                          ⚡ Fastest
                        </span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
