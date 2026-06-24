import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Attraction {
  placeId: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  lat: number;
  lng: number;
  timeRequired: string;
  entryFee: string;
  bestTimeToVisit: string;
  category: string;
  city?: string;
}

interface AttractionsListProps {
  attractions: Attraction[];
  destinationCity?: string;
  destLat?: number;
  destLng?: number;
}

function AttractionCard({ attraction, index }: { attraction: Attraction; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      layout
      className="glass-card overflow-hidden card-hover"
    >
      <div className="relative h-48 overflow-hidden">
        {!imgError ? (
          <img
            src={attraction.image || `https://picsum.photos/seed/${encodeURIComponent(attraction.name)}/400/300`}
            alt={attraction.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-4xl">
            🏛️
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700">
          ⭐ {attraction.rating || 'N/A'}
        </div>
        {attraction.category && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
            {attraction.category}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-lg">{attraction.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {expanded ? attraction.description : `${(attraction.description || '').slice(0, 120)}...`}
        </p>
        {attraction.description && attraction.description.length > 120 && (
          <button onClick={() => setExpanded(!expanded)} className="text-blue-600 text-xs mt-1 hover:text-blue-700">
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400 dark:text-gray-500">
          {attraction.timeRequired && <span>⏱️ {attraction.timeRequired}</span>}
          {attraction.entryFee && <span>💰 {attraction.entryFee}</span>}
          {attraction.bestTimeToVisit && <span>📅 {attraction.bestTimeToVisit}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export default function AttractionsList({ attractions, destinationCity, destLat, destLng }: AttractionsListProps) {
  const [search, setSearch] = useState('');
  const [destPhotos, setDestPhotos] = useState<string[]>([]);
  const [carouselIdx, setCarouselIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!destinationCity) return;
    const fetchPhotos = async () => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(destinationCity)}&prop=images&imlimit=20&format=json&origin=*`
        );
        const data = await res.json();
        const page = Object.values(data?.query?.pages || {})[0] as any;
        const titles = (page?.images || []).map((img: any) => img.title).slice(0, 8);
        const urls: string[] = [];
        for (const title of titles) {
          const imgRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`
          );
          const imgData = await imgRes.json();
          const imgPage = Object.values(imgData?.query?.pages || {})[0] as any;
          const url = imgPage?.imageinfo?.[0]?.url;
          if (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'))) urls.push(url);
        }
        setDestPhotos(urls.length > 0 ? urls : [
          `https://picsum.photos/seed/${encodeURIComponent(destinationCity)}1/600/400`,
          `https://picsum.photos/seed/${encodeURIComponent(destinationCity)}2/600/400`,
          `https://picsum.photos/seed/${encodeURIComponent(destinationCity)}3/600/400`,
        ]);
      } catch { setDestPhotos([]); }
    };
    fetchPhotos();
  }, [destinationCity]);

  useEffect(() => {
    if (carouselIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCarouselIdx(prev => prev !== null && prev > 0 ? prev - 1 : prev);
      else if (e.key === 'ArrowRight') setCarouselIdx(prev => prev !== null && prev < destPhotos.length - 1 ? prev + 1 : prev);
      else if (e.key === 'Escape') setCarouselIdx(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [carouselIdx, destPhotos.length]);

  if (!attractions || attractions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
        <div className="text-6xl mb-4">🏛️</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No attractions found</h3>
        <p className="text-gray-400 dark:text-gray-500">Try different route or check back later.</p>
      </motion.div>
    );
  }

  const destAttractions = destinationCity
    ? attractions.filter(a => a.city?.toLowerCase() === destinationCity.toLowerCase())
    : [];
  const otherAttractions = destinationCity
    ? attractions.filter(a => a.city?.toLowerCase() !== destinationCity.toLowerCase())
    : attractions;

  const grouped = new Map<string, Attraction[]>();
  for (const a of otherAttractions) {
    const city = a.city || 'Other';
    if (!grouped.has(city)) grouped.set(city, []);
    grouped.get(city)!.push(a);
  }

  const filteredDest = destAttractions.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.description || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredGrouped = new Map(
    [...grouped.entries()].map(([city, list]) => [city, list.filter(a =>
      !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.description || '').toLowerCase().includes(search.toLowerCase())
    )])
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="section-title mb-0">🏛️ Attractions ({attractions.length})</h2>
        <input
          type="text"
          placeholder="Search attractions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-xs"
        />
      </div>

      {destPhotos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
            📸 {destinationCity} Photos
          </h3>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {destPhotos.map((url, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className="flex-shrink-0 w-40 rounded-xl overflow-hidden group"
              >
                <div className="h-24 overflow-hidden">
                  <img
                    src={url}
                    alt={`${destinationCity} ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center truncate px-1">
                  {destinationCity} #{i + 1}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredDest.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            {destinationCity} — Destination Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDest.map((attraction, i) => (
              <AttractionCard key={attraction.placeId || `dest-${i}`} attraction={attraction} index={i} />
            ))}
          </div>
        </div>
      )}

      {[...filteredGrouped.entries()].map(([city, list]) =>
        list.length > 0 && (
          <div key={city} className="mb-10">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              {city}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((attraction, i) => (
                <AttractionCard key={attraction.placeId || `${city}-${i}`} attraction={attraction} index={i} />
              ))}
            </div>
          </div>
        )
      )}

      {filteredDest.length === 0 && [...filteredGrouped.values()].every(l => l.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400"
        >
          {search ? 'No attractions match your search.' : 'No attractions found for this route.'}
        </motion.div>
      )}

      <AnimatePresence>
        {carouselIdx !== null && destPhotos[carouselIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCarouselIdx(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            <button
              onClick={() => setCarouselIdx(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {carouselIdx > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setCarouselIdx(carouselIdx - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {carouselIdx < destPhotos.length - 1 && (
              <button
                onClick={e => { e.stopPropagation(); setCarouselIdx(carouselIdx + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <motion.img
              key={carouselIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={destPhotos[carouselIdx]}
              alt={`${destinationCity} ${carouselIdx + 1}`}
              className="max-w-full max-h-[85vh] rounded-xl object-contain px-4 sm:px-8 md:px-16"
              onClick={e => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {destinationCity} — {carouselIdx + 1} of {destPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
