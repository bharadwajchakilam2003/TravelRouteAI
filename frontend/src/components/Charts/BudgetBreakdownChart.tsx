import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';

interface BudgetTier {
  accommodation: number;
  food: number;
  fuel: number;
  tollsAndParking: number;
  miscellaneous: number;
  total: number;
}

interface BudgetBreakdownChartProps {
  economy: BudgetTier;
  midRange: BudgetTier;
  luxury: BudgetTier;
}

const breakdownColors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];
const breakdownLabels = ['Accommodation', 'Food', 'Fuel', 'Tolls & Parking', 'Miscellaneous'];
const breakdownKeys: (keyof BudgetTier)[] = ['accommodation', 'food', 'fuel', 'tollsAndParking', 'miscellaneous'];

function TierBar({ tier, label, icon, color }: { tier: BudgetTier; label: string; icon: string; color: string }) {
  if (!tier || !tier.total) return null;
  const maxTotal = tier.total;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
        <span className="ml-auto text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(tier.total)}</span>
      </div>
      <div className="h-6 rounded-lg overflow-hidden flex bg-gray-100 dark:bg-gray-700">
        {breakdownKeys.map((key, i) => {
          const value = tier[key] as number;
          const pct = maxTotal > 0 ? (value / maxTotal) * 100 : 0;
          if (pct < 1) return null;
          return (
            <motion.div
              key={key}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              className="h-full first:rounded-l-lg last:rounded-r-lg flex items-center justify-center"
              style={{ backgroundColor: breakdownColors[i % breakdownColors.length], minWidth: pct > 6 ? undefined : 0 }}
              title={`${breakdownLabels[i]}: ${formatCurrency(value)}`}
            >
              {pct > 6 && (
                <span className="text-[10px] text-white font-bold drop-shadow-sm">{Math.round(pct)}%</span>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
        {breakdownKeys.map((key, i) => {
          const value = tier[key] as number;
          if (value <= 0) return null;
          return (
            <span key={key} className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: breakdownColors[i % breakdownColors.length] }} />
              {breakdownLabels[i]}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function BudgetBreakdownChart({ economy, midRange, luxury }: BudgetBreakdownChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span> Budget Breakdown (%)</h3>
      <TierBar tier={economy} label="Economy" icon="💚" color="green" />
      <TierBar tier={midRange} label="Mid-Range" icon="💙" color="blue" />
      <TierBar tier={luxury} label="Luxury" icon="💎" color="purple" />
    </motion.div>
  );
}