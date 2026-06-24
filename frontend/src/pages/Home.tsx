import { motion } from 'framer-motion';
import HeroSection from '../components/Hero/HeroSection';
import FamousBharatPlaces from '../components/common/FamousBharatPlaces';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FamousBharatPlaces />
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container-wide py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Why TravelRoute AI?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Plan smarter with AI-powered route analysis, weather forecasts, cost estimates, and attraction discovery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="glass-card p-6 text-center card-hover"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 py-16">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Plan Your Next Trip?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Enter your source and destination above and let TravelRoute AI do the rest.
          </p>
          <a
            href="#hero"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
}

const features = [
  { icon: '🗺️', title: 'Route Planning', description: 'Get detailed route maps with distance, time, and alternative routes between any two locations.' },
  { icon: '🏛️', title: 'Attractions Discovery', description: 'Discover famous tourist attractions, landmarks, and hidden gems along your route.' },
  { icon: '🌤️', title: 'Weather Forecasts', description: 'Check weather conditions for your travel dates with hourly and daily forecasts.' },
  { icon: '💰', title: 'Cost Estimates', description: 'Compare travel costs across car, bus, train, and flight to find the best option.' },
  { icon: '🏨', title: 'Hotel Recommendations', description: 'Find the best hotels near attractions with ratings, prices, and amenities.' },
  { icon: '🍽️', title: 'Restaurant Guide', description: 'Explore famous restaurants and local cuisine along your travel route.' },
  { icon: '🤖', title: 'AI Travel Assistant', description: 'Get personalized travel recommendations from our AI-powered assistant.' },
  { icon: '📱', title: 'Save & Share', description: 'Save your trips, download PDF itineraries, and share with friends and family.' },
];
