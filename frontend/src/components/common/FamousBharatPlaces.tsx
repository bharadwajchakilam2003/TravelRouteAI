import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { placesAPI } from '../../services/api';

interface FamousPlace {
  title: string;
  pageTitle: string;
  description: string;
  image: string;
  url: string;
  lat: number | null;
  lng: number | null;
  extract: string;
  category: string;
  tags: string[];
  city: string | null;
  state: string | null;
}

export default function FamousBharatPlaces() {
  const [places, setPlaces] = useState<FamousPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FamousPlace | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await placesAPI.getFamousIndianPlaces();
        if (data.success) setPlaces(data.places);
      } catch (err) {
        console.error('Failed to fetch famous places:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const categories = ['all', ...new Set(places.map(p => p.category))];

  const filtered = places.filter(p => {
    const matchFilter = filter === 'all' || p.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <section className="container-wide py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Famous Indian Places</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 sm:w-96 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container-wide py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Famous Indian Places
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Explore India's rich heritage — ancient cities, magnificent monuments, and cultural landmarks.
            Click any place to discover its history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 text-sm capitalize ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search places..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              No places match your search.
            </motion.div>
          ) : (
            <motion.div
              key={filter + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((place, i) => (
                <motion.div
                  key={place.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  layout
                  onClick={() => setSelected(place)}
                  className="glass-card overflow-hidden card-hover cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={place.image || `https://picsum.photos/seed/${encodeURIComponent(place.title)}/600/400`}
                      alt={place.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={e => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(place.category)}/600/400`;
                      }}
                    />
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white capitalize">
                      {place.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{place.pageTitle || place.title}</h3>
                    {(place.city || place.state) && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                        {[place.city, place.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <p className="text-gray-500 dark:text-gray-400 text-sm overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {place.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all z-10"
              >
                ✕
              </button>

              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src={selected.image || `https://picsum.photos/seed/${encodeURIComponent(selected.title)}/800/400`}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(selected.category)}/800/400`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-xs text-white capitalize">
                      {selected.category}
                    </span>
                    {(selected.city || selected.state) && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        {[selected.city, selected.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">{selected.pageTitle || selected.title}</h2>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {selected.extract ? (
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {selected.extract}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selected.description}
                    </p>
                  )}
                </div>

                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {selected.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300 capitalize"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
                >
                  Read more on Wikipedia
                  <span>↗</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
