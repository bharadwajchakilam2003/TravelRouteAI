import { motion } from 'framer-motion';

interface SuggestionProps {
  destination: { name: string; lat: number; lng: number };
  attractions: any[];
  source: string;
}

const climateGuide: Record<string, { best: string; avoid: string; reason: string }> = {
  'north': { best: 'October to March', avoid: 'April to June (extreme heat), July to September (heavy monsoon)', reason: 'Pleasant weather, clear skies, and ideal temperatures for sightseeing' },
  'south': { best: 'October to March', avoid: 'April to June (very hot & humid)', reason: 'Cooler temperatures, lower humidity, and pleasant sea breezes' },
  'east': { best: 'October to March', avoid: 'June to September (heavy monsoon), April to May (humid heat)', reason: 'Comfortable weather with minimal rainfall' },
  'west': { best: 'November to February', avoid: 'March to June (scorching heat), July to September (monsoon)', reason: 'Pleasant winter weather perfect for desert and coastal exploration' },
  'central': { best: 'October to March', avoid: 'April to June (extreme heat)', reason: 'Cool and dry weather ideal for wildlife safaris and temple visits' },
  'north-east': { best: 'October to April', avoid: 'May to September (heavy monsoon)', reason: 'Dry season with blooming landscapes and comfortable temperatures' },
  'himalayan': { best: 'April to June, September to November', avoid: 'December to February (extreme cold, snow closures), July to August (landslides)', reason: 'Clear mountain views, blooming meadows, and pleasant weather' },
  'coastal': { best: 'November to March', avoid: 'June to September (monsoon storms)', reason: 'Calm seas, sunny days, and ideal beach weather' },
};

const cityClimate: Record<string, string> = {
  'mumbai': 'coastal', 'goa': 'coastal', 'chennai': 'coastal', 'kochi': 'coastal',
  'kozhikode': 'coastal', 'mangalore': 'coastal', 'visakhapatnam': 'coastal',
  'puri': 'coastal', 'kolkata': 'east', 'bhubaneswar': 'east', 'guwahati': 'north-east',
  'shillong': 'north-east', 'darjeeling': 'himalayan', 'shimla': 'himalayan',
  'manali': 'himalayan', 'nainital': 'himalayan', 'mussoorie': 'himalayan',
  'srinagar': 'himalayan', 'dharamshala': 'himalayan', 'leh': 'himalayan',
  'delhi': 'north', 'jaipur': 'north', 'agra': 'north', 'lucknow': 'north',
  'varanasi': 'north', 'amritsar': 'north', 'chandigarh': 'north', 'kanpur': 'north',
  'patna': 'east', 'ranchi': 'east', 'jamshedpur': 'east', 'siliguri': 'east',
  'bangalore': 'south', 'bengaluru': 'south', 'hyderabad': 'south', 'mysore': 'south',
  'coimbatore': 'south', 'madurai': 'south', 'thiruvananthapuram': 'south',
  'ahmedabad': 'west', 'surat': 'west', 'vadodara': 'west', 'rajkot': 'west',
  'jamnagar': 'west', 'jodhpur': 'west', 'udaipur': 'west', 'bhopal': 'central',
  'indore': 'central', 'nagpur': 'central', 'gwalior': 'central', 'jabalpur': 'central',
  'pune': 'west', 'nashik': 'west', 'aurangabad': 'west',
};

const tripIdeas: Record<string, string[]> = {
  'goa': ['Beach hopping (Baga, Anjuna, Palolem)', 'Dudhsagar Waterfalls trek', 'Old Goa church tour', 'Spice plantation visit', 'Sunset cruise on Mandovi River'],
  'mumbai': ['Marine Drive & Gateway of India', 'Elephanta Caves ferry', 'Street food crawl in Colaba', 'Bollywood studio tour', 'Sanjay Gandhi National Park'],
  'delhi': ['Red Fort & Chandni Chowk walk', 'Qutub Minar & Lotus Temple', 'Humayun\'s Tomb & Lodhi Garden', 'India Gate & Rashtrapati Bhavan', 'Dilli Haat & Akshardham Temple'],
  'jaipur': ['Amber Fort & Jaigarh Fort', 'City Palace & Jantar Mantar', 'Hawa Mahal & Bazaars', 'Nahargarh Fort sunset', 'Chokhi Dhani cultural evening'],
  'agra': ['Taj Mahal sunrise visit', 'Agra Fort & Mehtab Bagh', 'Fatehpur Sikri day trip', 'Local marble inlay workshop', 'Sweet shops for petha'],
  'varanasi': ['Ganga Aarti at Dasashwamedh Ghat', 'Morning boat ride on Ganges', 'Sarnath Buddhist ruins', 'Assi Ghat evening walk', 'Kashi Vishwanath Temple'],
  'hyderabad': ['Charminar & nearby Laad Bazaar', 'Golconda Fort sound & light show', 'Ramoji Film City', 'Salar Jung Museum', 'Hyderabadi biryani trail'],
  'bangalore': ['Palace of Mysore & Brindavan Gardens', 'Nandi Hills sunrise trek', 'Lalbagh & Cubbon Park', 'Commercial Street shopping', 'Craft beer pub crawl'],
  'chennai': ['Marina Beach & Santhome Cathedral', 'Kapaleeshwarar Temple', 'Fort St. George museum', 'Mahabalipuram day trip', 'Filter coffee at Mylapore'],
  'kolkata': ['Howrah Bridge & Hooghly River cruise', 'Victoria Memorial & Maidan', 'Kumartuli idol makers', 'College Street book market', 'Bengali sweet tour'],
  'kerala': ['Alleppey houseboat ride', 'Munnar tea gardens', 'Kochi Fort & Chinese nets', 'Kumarakom bird sanctuary', 'Kerala Sadya feast'],
};

function getClimateZone(city: string): string {
  const key = city.toLowerCase().trim();
  return cityClimate[key] || 'north';
}

export default function SuggestionsSection({ destination, attractions, source }: SuggestionProps) {
  const zone = getClimateZone(destination.name);
  const climate = climateGuide[zone] || climateGuide['north'];
  const ideas = tripIdeas[destination.name.toLowerCase().trim()] || [];

  const destAttractions = attractions.filter(a => {
    const cityMatch = a.city?.toLowerCase() === destination.name.toLowerCase();
    const nameMatch = a.name?.toLowerCase().includes(destination.name.toLowerCase());
    return cityMatch || nameMatch;
  }).slice(0, 6);

  const allAttractions = attractions.slice(0, 7);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="section-title">💡 Travel Suggestions</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📅</span> Best Time to Visit {destination.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✅</span>
              <span className="font-semibold text-green-700 dark:text-green-300 text-sm">Best Season</span>
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium">{climate.best}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{climate.reason}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <span className="font-semibold text-red-700 dark:text-red-300 text-sm">Avoid If Possible</span>
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">{climate.avoid}</p>
          </div>
        </div>
      </motion.div>

      {(allAttractions.length > 0 || destAttractions.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📍</span> Places to Visit in & around {destination.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(destAttractions.length > 0 ? destAttractions : allAttractions).map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 card-hover"
              >
                {a.image && (
                  <img src={a.image} alt={a.name} className="w-full h-28 object-cover rounded-lg mb-2" loading="lazy" />
                )}
                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{a.name}</h4>
                {a.city && <span className="text-xs text-blue-500">{a.city}</span>}
                {a.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">⭐</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{a.rating}</span>
                    {a.vicinity && <span className="text-xs text-gray-400 ml-2 truncate">{a.vicinity}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Top Things to Do in {destination.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ideas.map((idea, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-200">{idea}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🚗</span> Route Overview
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg font-medium">
            {source}
          </span>
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg font-medium">
            {destination.name}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}