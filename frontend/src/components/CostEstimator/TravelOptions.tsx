import { motion } from 'framer-motion';
import { formatCurrency, formatDuration } from '../../utils/helpers';

interface CarData {
  fuelCost: number; tollCharges: number; parkingCharges: number;
  totalCost: number; duration: number; fuelPricePerLiter: number; mileage: number;
}

interface BusOption { cost: number; duration: number; type: string; }

interface BusData { governmentBus: BusOption; privateBus: BusOption; }

interface FlightOption {
  airline: string; flightNumber: string; departureTime: string;
  arrivalTime: string; duration: string; price: number;
  cabinClass: string; stops: number;
}

interface FlightData { flights: FlightOption[]; }

interface TravelOptionsData {
  car?: CarData;
  bus?: BusData;
  flight?: FlightData;
}

interface TravelOptionsProps {
  costEstimates: TravelOptionsData;
  travelers: number;
}

const AIRLINE_COLORS: Record<string, string> = {
  'IndiGo': 'bg-indigo-500', 'SpiceJet': 'bg-orange-500',
  'Air India': 'bg-red-600', 'Vistara': 'bg-purple-600',
  'GoAir': 'bg-blue-500', 'Akasa Air': 'bg-teal-500',
  'Alliance Air': 'bg-cyan-600', 'Star Air': 'bg-amber-600',
  'FlyBig': 'bg-pink-500',
};

function CarOption({ car, travelers }: { car: CarData; travelers: number }) {
  const perPerson = Math.round(car.totalCost / travelers);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md text-lg flex-shrink-0">🚗</div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white">Car Travel</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{formatDuration(car.duration * 60)} journey</p>
        </div>
        <div className="ml-auto text-right">
          <div className="font-bold text-blue-600 text-lg">{formatCurrency(car.totalCost)}</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">total</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 text-center">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Fuel</div>
          <div className="font-semibold text-gray-800 dark:text-white text-sm">{formatCurrency(car.fuelCost)}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 text-center">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Toll</div>
          <div className="font-semibold text-gray-800 dark:text-white text-sm">{formatCurrency(car.tollCharges)}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 text-center">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Parking</div>
          <div className="font-semibold text-gray-800 dark:text-white text-sm">{formatCurrency(car.parkingCharges)}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 sm:p-3 text-center">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">Per Person</div>
          <div className="font-semibold text-green-600 text-sm">{formatCurrency(perPerson)}</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mt-3 text-xs text-gray-400 dark:text-gray-500 gap-1">
        <span>⛽ ₹{car.fuelPricePerLiter}/L · {car.mileage} km/L</span>
        <span>👥 {travelers} traveler{travelers > 1 ? 's' : ''}</span>
      </div>
    </motion.div>
  );
}

function BusOptionCard({ bus, travelers }: { bus: BusData; travelers: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md text-lg flex-shrink-0">🚌</div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white">Bus Travel</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">Two comfort options</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 sm:p-4 border border-green-200/50 dark:border-green-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{bus.governmentBus.type}</span>
            <span className="text-[10px] bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full font-medium">Budget</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-green-600">{formatCurrency(bus.governmentBus.cost)}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">/person</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">×{travelers}</span>
            <span className="text-sm font-semibold text-green-700">{formatCurrency(bus.governmentBus.cost * travelers)}</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">⏱️ {formatDuration(bus.governmentBus.duration * 60)}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 sm:p-4 border border-purple-200/50 dark:border-purple-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{bus.privateBus.type}</span>
            <span className="text-[10px] bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-medium">Comfort</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-600">{formatCurrency(bus.privateBus.cost)}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">/person</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400 dark:text-gray-500">×{travelers}</span>
            <span className="text-sm font-semibold text-purple-700">{formatCurrency(bus.privateBus.cost * travelers)}</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">⏱️ {formatDuration(bus.privateBus.duration * 60)}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FlightOptionCard({ flight, travelers }: { flight: FlightData; travelers: number }) {
  if (!flight.flights || flight.flights.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md text-lg flex-shrink-0">✈️</div>
          <h3 className="font-bold text-gray-800 dark:text-white">Flight</h3>
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-sm">No flight data available for this route.</p>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 sm:p-6 card-hover">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md text-lg flex-shrink-0">✈️</div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white">Flight Options</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{flight.flights.length} flight{flight.flights.length > 1 ? 's' : ''} available</p>
        </div>
      </div>
      <div className="space-y-2">
        {flight.flights.slice(0, 4).map((f, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
            <div className={`w-9 h-9 rounded-lg ${AIRLINE_COLORS[f.airline] || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm`}>
              {f.airline.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">{f.airline}</div>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <span className="font-mono">{f.flightNumber}</span>
                <span>·</span>
                <span>{f.departureTime} – {f.arrivalTime}</span>
              </div>
              {f.cabinClass && <span className="text-[10px] text-gray-400 block">{f.cabinClass}</span>}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-gray-800 dark:text-white">{formatCurrency(f.price)}</div>
              <div className="text-[10px] text-gray-400">/person</div>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${f.stops === 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
                  {f.stops === 0 ? 'Non-stop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
                </span>
                <span className="text-xs text-gray-400">{f.duration}</span>
              </div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                ×{travelers} = {formatCurrency(f.price * travelers)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 italic">✈️ Flight data via Amadeus & AviationStack</p>
    </motion.div>
  );
}

export default function TravelOptions({ costEstimates, travelers }: TravelOptionsProps) {
  return (
    <div className="space-y-6">
      <h2 className="section-title">🚗 Travel Options</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4">Compare bus, car, and flight options for your trip</p>
      <div className="grid grid-cols-1 gap-6">
        {costEstimates.car && <CarOption car={costEstimates.car} travelers={travelers} />}
        {costEstimates.bus && <BusOptionCard bus={costEstimates.bus} travelers={travelers} />}
        {costEstimates.flight && <FlightOptionCard flight={costEstimates.flight} travelers={travelers} />}
      </div>
    </div>
  );
}
