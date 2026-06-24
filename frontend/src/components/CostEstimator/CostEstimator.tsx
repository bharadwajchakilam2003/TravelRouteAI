import { motion } from 'framer-motion';
import { formatCurrency, formatDuration } from '../../utils/helpers';

interface CostEstimates {
  car: { fuelCost: number; tollCharges: number; parkingCharges: number; totalCost: number; duration: number; fuelPricePerLiter: number; mileage: number };
  bus: { governmentBus: { cost: number; duration: number; type: string }; privateBus: { cost: number; duration: number; type: string } };
  train: { trains: Array<{ trainNumber: string; trainName: string; departureTime: string; arrivalTime: string; duration: string; classes: Array<{ name: string; fare: number; available: boolean }> }> };
  flight: { flights: Array<{ airline: string; flightNumber: string; departureTime: string; arrivalTime: string; duration: string; price: number; cabinClass: string; stops: number }> };
}

interface CostEstimatorProps {
  costEstimates: CostEstimates;
  travelers: number;
}

function CarCost({ car, travelers }: { car: CostEstimates['car']; travelers: number }) {
  const perPerson = Math.round(car.totalCost / travelers);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 card-hover">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🚗 Car</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Fuel Cost</span>
          <span className="font-semibold">{formatCurrency(car.fuelCost)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Toll Charges</span>
          <span className="font-semibold">{formatCurrency(car.tollCharges)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Parking</span>
          <span className="font-semibold">{formatCurrency(car.parkingCharges)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Per Person</span>
          <span className="font-semibold text-green-600">{formatCurrency(perPerson)}</span>
        </div>
        <div className="flex justify-between items-center py-2 text-lg">
          <span className="font-bold text-gray-700 dark:text-gray-200">Total ({travelers} pax)</span>
          <span className="font-bold text-blue-600">{formatCurrency(car.totalCost)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>⏱️ {formatDuration(car.duration * 60)}</span>
          <span>⛽ ₹{car.fuelPricePerLiter}/L | {car.mileage} km/L</span>
        </div>
      </div>
    </motion.div>
  );
}

function BusCost({ bus, travelers }: { bus: CostEstimates['bus']; travelers: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 card-hover">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🚌 Bus</h3>
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">{bus.governmentBus.type}</span>
            <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">Budget</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Per person</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(bus.governmentBus.cost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total ({travelers} pax)</span>
              <span className="font-semibold text-green-700">{formatCurrency(bus.governmentBus.cost * travelers)}</span>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">⏱️ {formatDuration(bus.governmentBus.duration * 60)}</span>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">{bus.privateBus.type}</span>
            <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">Comfort</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Per person</span>
              <span className="text-2xl font-bold text-purple-600">{formatCurrency(bus.privateBus.cost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total ({travelers} pax)</span>
              <span className="font-semibold text-purple-700">{formatCurrency(bus.privateBus.cost * travelers)}</span>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">⏱️ {formatDuration(bus.privateBus.duration * 60)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrainCost({ train, travelers }: { train: CostEstimates['train']; travelers: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 card-hover">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🚆 Train</h3>
      {train.trains.map((t, i) => (
        <div key={i} className="mb-4 last:mb-0">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-200">{t.trainName}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({t.trainNumber})</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t.departureTime} - {t.arrivalTime}</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">⏱️ {t.duration}</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {t.classes.map((cls, j) => (
              <div key={j} className={`rounded-lg p-2 text-center ${cls.available ? 'bg-gray-50 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}`}>
                <div className="text-xs text-gray-500 dark:text-gray-400">{cls.name}</div>
                <div className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{formatCurrency(cls.fare)}</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500">×{travelers} = {formatCurrency(cls.fare * travelers)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic">* Prices are estimates and may vary from official IRCTC fares.</p>
    </motion.div>
  );
}

const AIRLINE_COLORS: Record<string, string> = {
  'IndiGo': 'bg-indigo-500',
  'SpiceJet': 'bg-orange-500',
  'Air India': 'bg-red-600',
  'Vistara': 'bg-purple-600',
  'GoAir': 'bg-blue-500',
  'Akasa Air': 'bg-teal-500',
  'Alliance Air': 'bg-cyan-600',
  'Star Air': 'bg-amber-600',
  'FlyBig': 'bg-pink-500',
};

function FlightCost({ flight, travelers }: { flight: CostEstimates['flight']; travelers: number }) {
  if (!flight.flights || flight.flights.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">✈️ Flight</h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Flight data unavailable for this route.</p>
      </motion.div>
    );
  }
  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">✈️ Flight</h3>
        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
          {flight.flights.length} option{flight.flights.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {flight.flights.slice(0, 4).map((f, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-xl ${AIRLINE_COLORS[f.airline] || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                {f.airline.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">{f.airline}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span className="font-mono">{f.flightNumber}</span>
                  <span>•</span>
                  <span>{f.departureTime} - {f.arrivalTime}</span>
                </div>
                {f.cabinClass && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                    {f.cabinClass}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-gray-800 dark:text-white text-lg">{formatCurrency(f.price)}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500">/person</div>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${f.stops === 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
                  {f.stops === 0 ? 'Non-stop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{f.duration}</span>
              </div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                ×{travelers} = {formatCurrency(f.price * travelers)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 italic">
        ✈️ Flight data via Amadeus & AviationStack • Prices are estimates
      </p>
    </motion.div>
  );
}

export default function CostEstimator({ costEstimates, travelers }: CostEstimatorProps) {
  return (
    <div className="space-y-6">
      <h2 className="section-title">💰 Cost Estimates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {costEstimates.car && <CarCost car={costEstimates.car} travelers={travelers} />}
        {costEstimates.bus && <BusCost bus={costEstimates.bus} travelers={travelers} />}
        {costEstimates.train && <TrainCost train={costEstimates.train} travelers={travelers} />}
        {costEstimates.flight && <FlightCost flight={costEstimates.flight} travelers={travelers} />}
      </div>
    </div>
  );
}
