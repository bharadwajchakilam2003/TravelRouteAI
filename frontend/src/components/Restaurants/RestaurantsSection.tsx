import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';

interface City {
  name: string;
  lat: number;
  lng: number;
}

interface RestaurantsSectionProps {
  cities: City[];
}

const MOCK_RESTAURANTS = [
  { name: 'The Flavors Kitchen', rating: 4.5, cuisine: 'North Indian, Mughlai', costForTwo: 1200, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', location: 'Highway Plaza' },
  { name: 'Coastal Delight', rating: 4.3, cuisine: 'South Indian, Seafood', costForTwo: 800, image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80', location: 'City Center' },
  { name: 'Dhaba Highway', rating: 4.0, cuisine: 'Punjabi, North Indian', costForTwo: 500, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', location: 'Highway Exit 7' },
  { name: 'Spice Garden', rating: 4.6, cuisine: 'Multi-cuisine, Continental', costForTwo: 1500, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80', location: 'Mall Road' },
  { name: 'The Great Indian Rasoi', rating: 4.2, cuisine: 'Rajasthani, Gujarati', costForTwo: 600, image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80', location: 'Old Town' },
  { name: 'Sushi & Rolls', rating: 4.4, cuisine: 'Asian, Japanese', costForTwo: 2000, image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&q=80', location: 'Downtown' },
  { name: 'Pizza Paradise', rating: 4.1, cuisine: 'Italian, Fast Food', costForTwo: 700, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', location: 'Market Square' },
  { name: 'Street Food Corner', rating: 3.9, cuisine: 'Street Food, Local', costForTwo: 200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', location: 'Bus Stand' },
];

export default function RestaurantsSection({ cities }: RestaurantsSectionProps) {
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');

  const cuisines = ['all', ...new Set(MOCK_RESTAURANTS.map((r) => r.cuisine.split(',')[0].trim()))];

  const filtered = MOCK_RESTAURANTS.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchCuisine = cuisineFilter === 'all' || r.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase());
    return matchSearch && matchCuisine;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="section-title mb-0">🍽️ Restaurants</h2>
        <input
          type="text"
          placeholder="Search restaurants or cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setCuisineFilter(c)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 text-sm capitalize ${
              cuisineFilter === c
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((restaurant, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden card-hover"
          >
            <div className="h-40 overflow-hidden">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{restaurant.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{restaurant.location}</p>
                </div>
                <span className="text-sm font-bold text-green-600">{formatCurrency(restaurant.costForTwo)}<span className="text-xs text-gray-400 dark:text-gray-500 font-normal">/2</span></span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{restaurant.rating}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{restaurant.cuisine}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
