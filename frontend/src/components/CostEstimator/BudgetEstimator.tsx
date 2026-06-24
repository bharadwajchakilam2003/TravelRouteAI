import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';

interface BudgetTier {
  accommodation: number;
  food: number;
  transport: number;
  fuel: number;
  tollsAndParking: number;
  miscellaneous: number;
  total: number;
  perPerson: number;
}

interface BudgetData {
  distanceKm: number;
  travelers: number;
  daysOnRoad: number;
  fuelPrices: { petrol: number; diesel: number; crudeOil: number };
  economy: BudgetTier;
  midRange: BudgetTier;
  luxury: BudgetTier;
  factors: { inflationRate: number; crudeOilPrice: number; dailyTravelDistance: number };
  disclaimer: string;
}

interface BudgetEstimatorProps {
  budget: BudgetData;
}

function TierCard({ label, tier, color, icon }: { label: string; tier: BudgetTier; color: string; icon: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 card-hover">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold text-gray-800 dark:text-white">{label}</h4>
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{formatCurrency(tier.total)}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">🏠 Accommodation</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(tier.accommodation)}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">🍽️ Food</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(tier.food)}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">⛽ Fuel</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(tier.fuel)}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">🛣️ Tolls & Parking</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(tier.tollsAndParking)}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">🎲 Miscellaneous</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{formatCurrency(tier.miscellaneous)}</span>
        </div>
        <div className="flex justify-between py-2 text-base">
          <span className="font-bold text-gray-700 dark:text-gray-200">Total</span>
          <span className="font-bold text-blue-600">{formatCurrency(tier.total)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>Per person</span>
          <span className="font-semibold text-green-600">{formatCurrency(tier.perPerson)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BudgetEstimator({ budget }: BudgetEstimatorProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="section-title mb-0">📊 Estimated Trip Budget</h2>
        <div className="text-xs text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
          <span className="block">📏 {budget.distanceKm} km · 👥 {budget.travelers} travelers · 📅 {budget.daysOnRoad} days</span>
          <span className="block mt-1">⛽ Petrol ₹{budget.fuelPrices.petrol}/L · Diesel ₹{budget.fuelPrices.diesel}/L · 🛢️ Crude ${budget.fuelPrices.crudeOil}/bbl</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TierCard label="Economy" tier={budget.economy} color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" icon="💚" />
        <TierCard label="Mid-Range" tier={budget.midRange} color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" icon="💙" />
        <TierCard label="Luxury" tier={budget.luxury} color="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" icon="💎" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0">📌</span>
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium mb-1">How this is calculated</p>
            <ul className="space-y-1 list-disc list-inside text-amber-700 dark:text-amber-300">
              <li>Fuel price adjusted for crude oil (${budget.factors.crudeOilPrice}/bbl) and {Math.round(budget.factors.inflationRate * 100)}% annual inflation</li>
              <li>Accommodation based on {budget.daysOnRoad} days on road (~{budget.factors.dailyTravelDistance} km/day)</li>
              <li>Food calculated per person per day for {budget.daysOnRoad} days × {budget.travelers} travelers</li>
              <li>Miscellaneous includes snacks, local transport, tips, and emergencies</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <p className="text-xs text-gray-400 dark:text-gray-500 italic">{budget.disclaimer}</p>
    </div>
  );
}
