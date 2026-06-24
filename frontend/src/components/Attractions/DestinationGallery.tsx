import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PhotoInfo {
  url: string;
  title: string;
}

interface DestinationGalleryProps {
  city: string;
  lat: number;
  lng: number;
}

function cleanTitle(title: string): string {
  return title
    .replace(/^File:/i, '')
    .replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function DestinationGallery({ city, lat, lng }: DestinationGalleryProps) {
  const [photos, setPhotos] = useState<PhotoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  const goPrev = () => setSelectedPhoto(p => p !== null && p > 0 ? p - 1 : p);
  const goNext = () => setSelectedPhoto(p => p !== null && p < photos.length - 1 ? p + 1 : p);

  useEffect(() => {
    if (selectedPhoto === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedPhoto, photos.length]);

  useEffect(() => {
    if (!city) return;
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(city)}&prop=images&imlimit=30&format=json&origin=*`
        );
        const data = await res.json();
        const pages = data?.query?.pages;
        if (pages) {
          const images: PhotoInfo[] = [];
          const page = Object.values(pages)[0] as any;
          const titles = (page?.images || []).map((img: any) => img.title);

          for (const title of titles.slice(0, 12)) {
            const imgRes = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json&origin=*`
            );
            const imgData = await imgRes.json();
            const imgPages = imgData?.query?.pages;
            if (imgPages) {
              const imgPage = Object.values(imgPages)[0] as any;
              const url = imgPage?.imageinfo?.[0]?.url;
              if (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'))) {
                images.push({ url, title: cleanTitle(title) });
              }
            }
          }
          setPhotos(images.length > 0 ? images : getFallbackImages(city));
        } else {
          setPhotos(getFallbackImages(city));
        }
      } catch {
        setPhotos(getFallbackImages(city));
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [city]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No photos available</h3>
        <p className="text-gray-400 dark:text-gray-500">Photos for {city} could not be loaded.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="section-title mb-6">📸 {city} Photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedPhoto(i)}
            className="rounded-xl overflow-hidden group bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 px-2.5 py-2 truncate font-medium">{photo.title}</p>
          </motion.button>
        ))}
      </div>

      {selectedPhoto !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
          onTouchStart={e => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchStart;
            if (Math.abs(dx) > 50) dx > 0 ? goPrev() : goNext();
          }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative flex flex-col items-center max-w-5xl w-full">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 z-10"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              key={selectedPhoto}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={photos[selectedPhoto].url}
              alt={photos[selectedPhoto].title}
              className="max-w-full max-h-[75vh] rounded-xl object-contain pointer-events-none"
              onClick={e => e.stopPropagation()}
            />
            <div className="mt-3 text-center pointer-events-none">
              <p className="text-white font-semibold text-sm sm:text-base">{photos[selectedPhoto].title}</p>
              <p className="text-white/50 text-xs mt-1">{selectedPhoto + 1} / {photos.length}</p>
            </div>
            {selectedPhoto > 0 && (
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl sm:text-2xl transition-colors">
                &lt;
              </button>
            )}
            {selectedPhoto < photos.length - 1 && (
              <button onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl sm:text-2xl transition-colors">
                &gt;
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function getFallbackImages(city: string): PhotoInfo[] {
  const queries = [
    `${city} city`,
    `${city} travel`,
    `${city} landmark`,
  ];
  return queries.map((q, i) => ({
    url: `https://source.unsplash.com/600x400/?${encodeURIComponent(q)},india`,
    title: `${city} ${['Cityscape', 'Travel View', 'Landmark'][i] || 'Photo'}`
  }));
}
