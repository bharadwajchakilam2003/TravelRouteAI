import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface CultureState {
  id: string; name: string; capital: string; region: string;
  description: string; ancientName: string; age: string;
  tourismTagline: string; formation: string; language: string;
  statehoodDay: string; area: string; famousFor: string[];
}

interface CityDetail {
  name: string; description: string; founded: string; highlights: string[];
}

interface Dynasty {
  name: string; period: string; capital: string;
  notableRulers: string[]; significance: string;
}

interface Tradition {
  title: string; description: string;
}

interface StateDetail extends CultureState {
  famousCities: CityDetail[];
  dynasties: Dynasty[];
  famousKings: string[];
  traditions: Tradition[];
  cuisine: string[];
  dance: string[];
  festivals: string[];
  culturalSignificance: string;
}

const regionColors: Record<string, string> = {
  'South India': 'from-blue-500 to-cyan-500',
  'North India': 'from-green-500 to-emerald-500',
  'East India': 'from-orange-500 to-red-500',
  'West India': 'from-purple-500 to-pink-500',
  'Central India': 'from-amber-500 to-yellow-500',
  'North-East India': 'from-teal-500 to-green-500',
};

const regionEmojis: Record<string, string> = {
  'South India': '🌴', 'North India': '🏔️', 'East India': '🌊',
  'West India': '🏜️', 'Central India': '🌳', 'North-East India': '🌺',
};

const regionAltNames: Record<string, string> = {
  'South India': 'South Bharat',
  'North India': 'North Bharat',
  'East India': 'East Bharat',
  'West India': 'West Bharat',
  'Central India': 'Central Bharat',
  'North-East India': 'North-East Bharat',
};

function StateCard({ state, onClick }: { state: CultureState; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className="glass-card p-5 card-hover cursor-pointer group flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${regionColors[state.region] || 'from-blue-500 to-purple-500'} mb-4`} />
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md">
          {state.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base">
            {state.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {regionEmojis[state.region] || '📍'} {state.region}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed flex-1">{state.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
          🏛️ {state.capital}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
          🗣️ {state.language}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
          📜 {state.ancientName}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        {state.famousFor.slice(0, 3).map((item, i) => (
          <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {item}
          </span>
        ))}
        {state.famousFor.length > 3 && (
          <span className="text-[11px] text-blue-500 font-medium px-1">+{state.famousFor.length - 3}</span>
        )}
      </div>
    </motion.div>
  );
}

const sectionIcons: Record<string, { icon: string; label: string }> = {
  overview: { icon: '📋', label: 'Overview' },
  history: { icon: '🏰', label: 'History & Kings' },
  cities: { icon: '🏙️', label: 'Cities' },
  culture: { icon: '🎭', label: 'Arts & Culture' },
  cuisine: { icon: '🍛', label: 'Cuisine' },
  traditions: { icon: '🪔', label: 'Traditions' },
};

function StateDetailModal({ state, onClose }: { state: StateDetail; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('overview');
  const sectionIds = Object.keys(sectionIcons);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-4 sm:py-6 px-3 sm:px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${regionColors[state.region] || 'from-blue-600 to-purple-600'} p-5 sm:p-8 relative`}>
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm text-lg">
            ✕
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 text-white/70 text-xs sm:text-sm">
            <span>{regionEmojis[state.region]} {state.region}</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline">🗣️ {state.language}</span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span>📐 {state.area}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{state.name}</h2>
          <p className="text-white/70 text-sm sm:text-base italic">"{state.tourismTagline}"</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            <span className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-white text-[11px] sm:text-xs">🏛️ {state.capital}</span>
            <span className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-white text-[11px] sm:text-xs">📜 {state.ancientName}</span>
            <span className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-white text-[11px] sm:text-xs">⏳ {state.age}</span>
            <span className="bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-white text-[11px] sm:text-xs">📅 {state.statehoodDay}</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-1 px-3 sm:px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 scrollbar-hide">
          {sectionIds.map(id => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                activeSection === id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {sectionIcons[id].icon} <span className="hidden sm:inline ml-1">{sectionIcons[id].label}</span>
              <span className="sm:hidden ml-1">{sectionIcons[id].label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeSection === 'overview' && (
                <div className="space-y-4 sm:space-y-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{state.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="glass-card p-4 sm:p-5">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">✨ Famous For</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {state.famousFor.map((f, i) => (
                          <span key={i} className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium shadow-sm">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card p-4 sm:p-5">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">🎭 Cultural Significance</h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">{state.culturalSignificance}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'history' && (
                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {state.dynasties.map((d, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">{d.name}</h4>
                          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap flex-shrink-0">{d.period}</span>
                        </div>
                        {d.capital && <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">🏛️ Capital: {d.capital}</p>}
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{d.significance}</p>
                        {d.notableRulers.length > 0 && (
                          <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-gray-100 dark:border-gray-700/50">
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">👑 Notable Rulers:</p>
                            <div className="flex flex-wrap gap-1">
                              {d.notableRulers.map((r, j) => (
                                <span key={j} className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/30">{r}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  {state.famousKings.length > 0 && (
                    <div className="glass-card p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-700/30">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">👑 Greatest Kings & Rulers</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {state.famousKings.map((k, i) => (
                          <div key={i} className="flex items-start gap-2 bg-white/60 dark:bg-gray-800/40 rounded-lg p-2.5 sm:p-3">
                            <span className="text-base sm:text-lg flex-shrink-0">👑</span>
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{k}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'cities' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {state.famousCities.map((city, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {city.name[0]}
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">{city.name}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{city.description}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">📅 {city.founded}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {city.highlights.map((h, j) => (
                          <span key={j} className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50">{h}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeSection === 'culture' && (
                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="glass-card p-4 sm:p-5">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">💃 Dance Forms</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {state.dance.map((d, i) => (
                          <span key={i} className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-700 dark:text-pink-300 text-xs sm:text-sm font-medium shadow-sm border border-pink-200/50 dark:border-pink-700/30">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card p-4 sm:p-5">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">🎉 Festivals</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {state.festivals.map((f, i) => (
                          <span key={i} className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-300 text-xs sm:text-sm font-medium shadow-sm border border-orange-200/50 dark:border-orange-700/30">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-4 sm:p-5">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm sm:text-base">🥘 Cuisine</h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {state.cuisine.map((c, i) => (
                        <span key={i} className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 text-xs sm:text-sm font-medium shadow-sm border border-green-200/50 dark:border-green-700/30">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'cuisine' && (
                <div className="space-y-4 sm:space-y-5">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Signature dishes and food traditions of <strong className="text-gray-800 dark:text-white">{state.name}</strong></p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {state.cuisine.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="glass-card p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-base sm:text-lg mx-auto mb-2 shadow-sm">🍽️</div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">{c}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'traditions' && (
                <div className="space-y-3 sm:space-y-4">
                  {state.traditions.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">✦</div>
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base mb-1">{t.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BharatCulture() {
  const [states, setStates] = useState<CultureState[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<StateDetail | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'South India', 'North India', 'East India', 'West India', 'Central India', 'North-East India'];

  useEffect(() => {
    setLoading(true);
    api.get('/culture/states').then(res => {
      if (res.data.success) setStates(res.data.states);
    }).finally(() => setLoading(false));
  }, []);

  const filteredStates = states.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !search || s.name.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q) || s.ancientName.toLowerCase().includes(q) || s.famousFor.some(f => f.toLowerCase().includes(q)) || s.region.toLowerCase().includes(q);
    const region = selectedRegion === 'All' || s.region === selectedRegion;
    return matchesSearch && region;
  });

  const openStateDetail = async (id: string) => {
    try {
      const res = await api.get(`/culture/states/${id}`);
      if (res.data.success) setSelectedState(res.data.state);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-800 py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.15)_0%,_transparent_50%)]" />
        <div className="container-wide text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            BharatCulture & Heritage
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Explore 23 states — their ancient dynasties, legendary kings, vibrant traditions, and rich cultural legacy
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-6 sm:mt-8 max-w-lg mx-auto relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search states, cities, or famous places..."
              className="w-full px-4 sm:px-5 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm sm:text-base"
            />
            <span className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">🔍</span>
          </motion.div>
        </div>
      </div>

      <div className="container-wide -mt-5 sm:-mt-6 relative z-10">
        <div className="flex overflow-x-auto gap-1.5 sm:gap-2 pb-2 scrollbar-hide">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl whitespace-nowrap text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                selectedRegion === r
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/50'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              {r === 'All' ? '🌟 All Regions' : `${regionEmojis[r] || '📍'} ${r}`}
            </button>
          ))}
        </div>
      </div>

      <div className="container-wide py-6 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 w-1/3" />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-1.5" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mt-3 w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mt-1.5 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredStates.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-5xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">No states found</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Try a different search term or region filter.</p>
          </div>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">{filteredStates.length} state{filteredStates.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredStates.map(state => (
                <StateCard key={state.id} state={state} onClick={() => openStateDetail(state.id)} />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedState && <StateDetailModal state={selectedState} onClose={() => setSelectedState(null)} />}
      </AnimatePresence>
    </div>
  );
}
