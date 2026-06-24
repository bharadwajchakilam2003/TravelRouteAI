import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';

interface City {
  name: string;
  lat: number;
  lng: number;
}

interface HotelsSectionProps {
  cities: City[];
}

const MOCK_HOTELS: Record<string, Array<{
  name: string;
  image: string;
  price: number;
  rating: number;
  amenities: string[];
  category: string;
}>> = {
  default: [
    { name: 'Grand Palace Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', price: 3500, rating: 4.5, amenities: ['WiFi', 'Pool', 'Breakfast', 'AC'], category: 'luxury' },
    { name: 'Comfort Inn', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80', price: 1800, rating: 4.0, amenities: ['WiFi', 'Breakfast', 'AC'], category: 'budget' },
    { name: 'Heritage Resort', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', price: 5500, rating: 4.8, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'AC'], category: 'luxury' },
    { name: 'City Lodge', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', price: 1200, rating: 3.8, amenities: ['WiFi', 'AC'], category: 'budget' },
    { name: 'Family Stay Inn', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', price: 2500, rating: 4.2, amenities: ['WiFi', 'Kitchen', 'Parking', 'AC'], category: 'family' },
    { name: 'Cozy Couples Retreat', image: 'https://images.unsplash.com/photo-1522771739013-7c97a335871c?w=400&q=80', price: 4200, rating: 4.6, amenities: ['WiFi', 'Spa', 'Restaurant', 'AC', 'Bar'], category: 'couples' },
  ]
};

export default function HotelsSection({ cities }: HotelsSectionProps) {
  const [selectedCity, setSelectedCity] = useState(cities[0]?.name || 'all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (!cities || cities.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No hotels available</h3>
        <p className="text-gray-400 dark:text-gray-500">Hotel data unavailable for this route.</p>
      </motion.div>
    );
  }

  const allHotels = MOCK_HOTELS.default;
  const filtered = allHotels.filter((h) => {
    if (priceFilter === 'budget' && h.price > 2000) return false;
    if (priceFilter === 'mid' && (h.price < 2000 || h.price > 4000)) return false;
    if (priceFilter === 'luxury' && h.price < 4000) return false;
    if (categoryFilter !== 'all' && h.category !== categoryFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="section-title">🏨 Hotels</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="input-field max-w-[160px]">
          <option value="all">All Prices</option>
          <option value="budget">Budget (≤₹2k)</option>
          <option value="mid">Mid (₹2k-₹4k)</option>
          <option value="luxury">Luxury (₹4k+)</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field max-w-[160px]">
          <option value="all">All Types</option>
          <option value="budget">Budget</option>
          <option value="family">Family</option>
          <option value="couples">Couples</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hotel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden card-hover"
          >
            <div className="h-48 overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{hotel.name}</h3>
                <span className="text-sm font-bold text-blue-600">{formatCurrency(hotel.price)}<span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/night</span></span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{hotel.rating}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 capitalize px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{hotel.category}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {hotel.amenities.map((a, j) => (
                  <span key={j} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-lg">{a}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
