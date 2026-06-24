import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, themes } from '../../context/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

interface SearchHistoryItem {
  source: string;
  destination: string;
  timestamp: number;
}

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('travel_history');
      if (stored) setSearchHistory(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setHistoryOpen(false);
    navigate(`/search?source=${encodeURIComponent(item.source)}&destination=${encodeURIComponent(item.destination)}`);
  };

  const clearHistory = () => {
    localStorage.removeItem('travel_history');
    setSearchHistory([]);
    setHistoryOpen(false);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700/50">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg transition-shadow">
              TR
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              TravelRoute AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium">Home</Link>
            <Link to="/culture" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1">
              BharatCulture
            </Link>

            <div className="relative">
              <ThemeSwitcher />
            </div>

            <div className="relative" ref={historyRef}>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative"
                title="Search History"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {searchHistory.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {searchHistory.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Recent Searches</h3>
                      {searchHistory.length > 0 && (
                        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600">
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {searchHistory.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          No searches yet
                        </div>
                      ) : (
                        searchHistory.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => handleHistoryClick(item)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-800 dark:text-gray-100">{item.source}</span>
                              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                              <span className="font-medium text-gray-800 dark:text-gray-100">{item.destination}</span>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">{formatTime(item.timestamp)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Home</Link>
              <Link to="/culture" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">BharatCulture</Link>
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">🎨 Theme</div>
                <div className="flex flex-wrap gap-1.5">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setIsOpen(false); }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        theme.id === t.id
                          ? 'text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      style={theme.id === t.id ? { background: t.gradient } : {}}
                    >
                      <span>{t.icon}</span>
                      <span className={theme.id === t.id ? '' : 'hidden sm:inline'}>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Recent Searches</div>
                {searchHistory.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400">No searches yet</div>
                ) : (
                  searchHistory.slice(0, 5).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setIsOpen(false); handleHistoryClick(item); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      {item.source} → {item.destination}
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
