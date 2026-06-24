import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
        <div className="container-wide text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            About TravelRoute AI
          </motion.h1>
          <p className="text-blue-200 mt-2">Your smart travel planning companion</p>
        </div>
      </div>
      <div className="container-wide py-12 max-w-3xl">
        <div className="space-y-8">
          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              TravelRoute AI helps travelers plan road trips and journeys across India by providing real-time route information, weather forecasts, cost estimates, attraction recommendations, and cultural heritage insights — all in one place.
            </p>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🗺️', title: 'Route Planning', desc: 'Calculate distances and travel times between any two cities' },
                { icon: '🌤️', title: 'Weather Forecasts', desc: 'Real-time weather data for your destinations' },
                { icon: '💰', title: 'Cost Estimates', desc: 'Budget planning with fuel, accommodation, and food costs' },
                { icon: '🏛️', title: 'Attractions', desc: 'Discover places to visit along your route' },
                { icon: '🎭', title: 'Cultural Heritage', desc: 'Explore India\'s rich history and traditions' },
                { icon: '🤖', title: 'AI Assistant', desc: 'Get personalized travel suggestions' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{f.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Developer</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                B
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Bharadwaj</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Full-stack developer & travel enthusiast</p>
                <a href="mailto:bharadwajchakilam2003@gmail.com" className="text-blue-600 hover:underline text-sm">bharadwajchakilam2003@gmail.com</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}