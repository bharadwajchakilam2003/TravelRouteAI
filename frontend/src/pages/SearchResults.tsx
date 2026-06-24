import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { searchAPI, placesAPI, weatherAPI } from '../services/api';
import { formatDistance, formatDuration } from '../utils/helpers';
import { downloadTripReport } from '../utils/downloadReport';

const DestinationGallery = lazy(() => import('../components/Attractions/DestinationGallery'));
const SuggestionsSection = lazy(() => import('../components/Suggestions/SuggestionsSection'));
const TravelOptions = lazy(() => import('../components/CostEstimator/TravelOptions'));
const WeatherSection = lazy(() => import('../components/Weather/WeatherSection'));
const CostEstimator = lazy(() => import('../components/CostEstimator/CostEstimator'));
const CostComparisonCard = lazy(() => import('../components/CostEstimator/CostComparisonCard'));
const BudgetEstimator = lazy(() => import('../components/CostEstimator/BudgetEstimator'));
const HotelsSection = lazy(() => import('../components/Hotels/HotelsSection'));
const RestaurantsSection = lazy(() => import('../components/Restaurants/RestaurantsSection'));
const RouteMap = lazy(() => import('../components/Map/RouteMap'));
const AIChat = lazy(() => import('../components/AIChat/AIChat'));
const CostComparisonChart = lazy(() => import('../components/Charts/CostComparisonChart'));
const TemperatureTrend = lazy(() => import('../components/Charts/TemperatureTrend'));
const BudgetBreakdownChart = lazy(() => import('../components/Charts/BudgetBreakdownChart'));

interface SearchResultsData {
  route: { distance: number; duration: number; polyline: string; alternativeRoutes: any[] };
  source: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  citiesOnRoute: { name: string; lat: number; lng: number }[];
  attractions: any[];
  weather: any[];
  costEstimates: {
    car: any; bus: any; train: any; flight: any;
    summary: { options: any[]; bestValue: any; fastest: any };
    budget: any;
  };
  travelers: number;
}

function TabFallback() {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function cacheKey(source: string, destination: string, travelers: number) {
  return `search_${source.toLowerCase()}_${destination.toLowerCase()}_${travelers}`;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResultsData | null>(() => {
    const source = searchParams.get('source') || '';
    const destination = searchParams.get('destination') || '';
    const travelers = parseInt(localStorage.getItem('travelers') || searchParams.get('travelers') || '1');
    const key = cacheKey(source, destination, travelers);
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(!results);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('photos');
  const [retryCount, setRetryCount] = useState(0);
  const [lazyAttractions, setLazyAttractions] = useState<any[]>([]);
  const [lazyWeather, setLazyWeather] = useState<any[]>([]);
  const [lazyLoading, setLazyLoading] = useState({ attractions: false, weather: false });

  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const travelDate = searchParams.get('travelDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const [travelers, setTravelers] = useState(() => parseInt(localStorage.getItem('travelers') || searchParams.get('travelers') || '1'));

  const fetchLazyData = useCallback(async (destLat: number, destLng: number) => {
    setLazyLoading({ attractions: true, weather: true });
    try {
      const [attrRes, wRes] = await Promise.all([
        placesAPI.getAttractions(destLat, destLng, 50000).catch(() => ({ attractions: [] })),
        weatherAPI.get(destLat, destLng, 1).catch(() => ({ forecast: [] }))
      ]);
      setLazyAttractions((attrRes?.attractions || []).map((a: any) => ({ ...a, city: destination })));
      setLazyWeather([{ city: destination, forecast: wRes?.forecast || [] }]);
    } catch {}
    setLazyLoading({ attractions: false, weather: false });
  }, [destination]);

  const doSearch = async (background = false) => {
    if (!source || !destination) return;
    if (!background) setLoading(true);
    setError(null);
    try {
      const data = await searchAPI.search({ source, destination, travelDate: travelDate || undefined, returnDate: returnDate || undefined, travelers });
      if (data.success) {
        setResults(data);
        try {
          sessionStorage.setItem(cacheKey(source, destination, travelers), JSON.stringify(data));
        } catch {}
        try {
          const stored = JSON.parse(localStorage.getItem('travel_history') || '[]');
          const filtered = stored.filter((s: any) => !(s.source.toLowerCase() === source.toLowerCase() && s.destination.toLowerCase() === destination.toLowerCase()));
          filtered.unshift({ source, destination, timestamp: Date.now() });
          localStorage.setItem('travel_history', JSON.stringify(filtered.slice(0, 20)));
        } catch (e) { console.error('Failed to save search history:', e); }
        if (data.destination?.lat && data.destination?.lng) {
          fetchLazyData(data.destination.lat, data.destination.lng);
        }
      } else {
        setError(data.message || 'No results found');
      }
    } catch (err: any) {
      if (!background) setError(err.response?.data?.message || 'Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results) {
      doSearch(true);
    } else {
      doSearch();
    }
  }, [retryCount]);

  const destinationWeather = useMemo(() =>
    (lazyWeather.length > 0 ? lazyWeather : results?.weather || []).filter((w: any) => w.city?.toLowerCase() === destination.toLowerCase()),
    [lazyWeather, results?.weather, destination]
  );

  const tabs = useMemo(() => ['photos', 'suggestions', 'travel-options', 'weather', 'costs', 'hotels', 'restaurants', 'map', 'ai-assistant'], []);

  if (!source || !destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">No search parameters</h2>
        <p className="text-gray-500 mb-6">Please enter a source and destination to search.</p>
        <a href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl">Go Home</a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div
          key={retryCount}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="text-6xl mb-6"
          >
            😕
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Search Error</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRetryCount(c => c + 1)}
              disabled={loading}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Retrying...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Retry</>
              )}
            </motion.button>
            <a href="/" className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm">
              Go Home
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-wide py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white truncate max-w-[40%]">{source}</h1>
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white truncate max-w-[40%]">{destination}</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {results?.route?.distance && <span className="flex items-center gap-1">📏 {formatDistance(results.route.distance)}</span>}
            {results?.route?.duration && <span className="flex items-center gap-1">⏱️ {formatDuration(results.route.duration)}</span>}
            <span className="relative">
              <select
                value={travelers}
                onChange={e => { const v = parseInt(e.target.value); setTravelers(v); localStorage.setItem('travelers', v.toString()); }}
                className="pl-7 pr-6 py-1 rounded-lg text-sm cursor-pointer appearance-none bg-white/80 dark:bg-gray-800/80 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 font-medium shadow-sm hover:border-blue-400 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                ))}
              </select>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none">👥</span>
            </span>
            {travelDate && <span className="flex items-center gap-1">📅 {travelDate}</span>}
            {results && (
              <button
                onClick={() => downloadTripReport({
                  source, destination,
                  distance: results.route?.distance || 0,
                  duration: results.route?.duration || 0,
                  travelDate: travelDate || undefined,
                  returnDate: returnDate || undefined,
                  travelers,
                  weather: results.weather || [],
                  costEstimates: results.costEstimates || {},
                  citiesOnRoute: results.citiesOnRoute || [],
                })}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Report
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab === 'ai-assistant' ? '🤖 AI Assistant' : tab === 'photos' ? '📸 Photos' : tab === 'suggestions' ? '💡 Suggestions' : tab === 'travel-options' ? '🚗 Travel Options' : tab === 'weather' ? '🌤️ Weather' : tab === 'costs' ? '💰 Costs' : tab === 'hotels' ? '🏨 Hotels' : tab === 'restaurants' ? '🍽️ Restaurants' : tab === 'map' ? '🗺️ Map' : tab}
          </button>
        ))}
      </div>

      {loading || !results ? (
        <TabFallback />
      ) : (
        <Suspense fallback={<TabFallback />}>
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {activeTab === 'photos' && results.destination && (
              <DestinationGallery city={destination} lat={results.destination.lat} lng={results.destination.lng} />
            )}
            {activeTab === 'suggestions' && <SuggestionsSection destination={results.destination} attractions={lazyAttractions} />}
            {activeTab === 'travel-options' && results.costEstimates && <TravelOptions costEstimates={results.costEstimates} travelers={travelers} />}
            {activeTab === 'weather' && (
              destinationWeather.length > 0 ? (
                <div>
                  <WeatherSection weather={destinationWeather} />
                  {destinationWeather.map((w, i) => w?.forecast && w.forecast.length >= 2 && (
                    <TemperatureTrend key={i} forecast={w.forecast} city={w.city || destination} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <div className="text-6xl mb-4">🌤️</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No weather data available</h3>
                  <p className="text-gray-400 dark:text-gray-500">Weather forecast could not be loaded for this route.</p>
                </div>
              )
            )}
            {activeTab === 'costs' && results.costEstimates && (
              <div className="space-y-6">
                {results.costEstimates.summary && (
                  <>
                    <CostComparisonCard summary={results.costEstimates.summary} travelers={travelers} />
                    <CostComparisonChart options={results.costEstimates.summary.options || []} travelers={travelers} />
                  </>
                )}
                {results.costEstimates.budget && (
                  <>
                    <BudgetEstimator budget={results.costEstimates.budget} />
                    {results.costEstimates.budget.economy && results.costEstimates.budget.midRange && results.costEstimates.budget.luxury && (
                      <BudgetBreakdownChart
                        economy={results.costEstimates.budget.economy}
                        midRange={results.costEstimates.budget.midRange}
                        luxury={results.costEstimates.budget.luxury}
                      />
                    )}
                  </>
                )}
                <CostEstimator costEstimates={results.costEstimates} travelers={travelers} />
              </div>
            )}
            {activeTab === 'hotels' && results.citiesOnRoute && <HotelsSection cities={results.citiesOnRoute} />}
            {activeTab === 'restaurants' && results.citiesOnRoute && <RestaurantsSection cities={results.citiesOnRoute} />}
            {activeTab === 'map' && results.source && results.destination && (
              <RouteMap
                source={results.source}
                destination={results.destination}
                attractions={lazyAttractions}
                polyline={results.route?.polyline}
              />
            )}
            {activeTab === 'ai-assistant' && source && destination && (
              <AIChat context={{ source, destination, distance: results.route?.distance || 0 }} />
            )}
          </motion.div>
        </Suspense>
      )}
    </div>
  );
}
