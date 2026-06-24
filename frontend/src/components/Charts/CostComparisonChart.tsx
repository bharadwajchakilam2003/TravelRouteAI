import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';

interface ChartOption {
  mode: string;
  cost: number;
  time: number;
  type: string;
  isBestValue?: boolean;
  isFastest?: boolean;
}

interface CostComparisonChartProps {
  options: ChartOption[];
  travelers: number;
}

const modeColors: Record<string, string> = {
  Car: '#3b82f6',
  Bus: '#22c55e',
  Train: '#f59e0b',
  Flight: '#ef4444',
};

const modeIcons: Record<string, string> = {
  Car: '🚗', Bus: '🚌', Train: '🚆', Flight: '✈️',
};

export default function CostComparisonChart({ options, travelers }: CostComparisonChartProps) {
  if (!options || options.length === 0) return null;

  const maxCost = Math.max(...options.map(o => o.mode === 'Car' ? o.cost : o.cost * travelers));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">📈</span> Cost Comparison Chart
      </h3>

      <div className="space-y-4">
        {options.map((option, i) => {
          const total = option.mode === 'Car' ? option.cost : option.cost * travelers;
          const width = maxCost > 0 ? (total / maxCost) * 100 : 0;

          return (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-lg w-8">{modeIcons[option.mode]}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 w-16">{option.mode}</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 w-28 text-right">{formatCurrency(total)}</span>
                <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.2, ease: 'easeOut' }}
                    className="h-full rounded-lg flex items-center justify-end px-2"
                    style={{ backgroundColor: modeColors[option.mode] || '#3b82f6', minWidth: width > 5 ? undefined : 0 }}
                  >
                    {width > 15 && (
                      <span className="text-[10px] text-white font-bold drop-shadow-sm">
                        {Math.round(width)}%
                      </span>
                    )}
                  </motion.div>
                </div>
                <div className="flex gap-1 w-28 justify-end">
                  {option.isBestValue && (
                    <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded font-medium">
                      👍 Value
                    </span>
                  )}
                  {option.isFastest && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                      ⚡ Fast
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}