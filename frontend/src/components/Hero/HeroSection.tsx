import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SearchForm from './SearchForm';

const backgrounds = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80',
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1920&q=80',
];

export default function HeroSection() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === bgIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm mb-6 border border-white/10"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Travel Planning
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-shadow leading-tight">
            Plan Your Perfect
            <span className="block gradient-primary bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-shadow">
            Discover attractions, weather, and costs between any two destinations with AI-powered insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <SearchForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mt-10 text-white/70 text-sm"
        >
          {['🌤️ Real-time Weather', '📍 Attractions Discovery', '💰 Cost Comparison', '🗺️ Interactive Maps'].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/5">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
    </section>
  );
}
