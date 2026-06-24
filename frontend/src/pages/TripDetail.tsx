import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { tripsAPI } from '../services/api';
import { formatDate, formatDistance, formatCurrency, formatDuration } from '../utils/helpers';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTrip = async () => {
      try {
        const res = await tripsAPI.getById(id);
        setTrip(res.trip);
      } catch {
        toast.error('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) return <LoadingSkeleton />;
  if (!trip) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Trip not found</h2>
        <Link to="/dashboard" className="text-blue-600 font-medium">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
        <div className="glass-card p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{trip.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span>📅 {formatDate(trip.travelDate)}</span>
            {trip.returnDate && <span>↔️ {formatDate(trip.returnDate)}</span>}
            <span>👥 {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3 text-lg mb-6">
            <span className="font-semibold text-gray-700">{trip.source?.name}</span>
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            <span className="font-semibold text-gray-700">{trip.destination?.name}</span>
          </div>
          {trip.route && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-blue-600">{formatDistance(trip.route.distance)}</div>
                <div className="text-xs text-gray-500">Distance</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-green-600">{formatDuration(trip.route.duration)}</div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-purple-600">{trip.attractions?.length || 0}</div>
                <div className="text-xs text-gray-500">Attractions</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-amber-600">{formatCurrency(trip.costEstimate?.summary?.options?.[0]?.cost || 0)}</div>
                <div className="text-xs text-gray-500">Est. Cost</div>
              </div>
            </div>
          )}
        </div>
        {trip.attractions && trip.attractions.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="section-title">🏛️ Attractions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.attractions.slice(0, 6).map((attraction: any, i: number) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <img src={attraction.image || `https://picsum.photos/seed/${encodeURIComponent(attraction.name)}/100/100`} alt={attraction.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{attraction.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{attraction.description?.slice(0, 100)}</p>
                    <div className="flex gap-2 mt-2 text-xs text-gray-400">
                      <span>⭐ {attraction.rating || 'N/A'}</span>
                      <span>💰 {attraction.entryFee || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {trip.weather && trip.weather.length > 0 && (
          <div className="glass-card p-6 mb-6">
            <h2 className="section-title">🌤️ Weather Forecast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trip.weather.slice(0, 4).map((w: any, i: number) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-sm font-medium text-gray-700">{w.city}</div>
                  <div className="text-2xl font-bold text-gray-800 my-1">{w.temperature}°C</div>
                  <div className="text-xs text-gray-500">{w.condition}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {trip.costEstimate?.summary && (
          <div className="glass-card p-6 mb-6">
            <h2 className="section-title">💰 Cost Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-500 font-medium">Mode</th>
                    <th className="text-right py-3 text-gray-500 font-medium">Cost</th>
                    <th className="text-right py-3 text-gray-500 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trip.costEstimate.summary.options?.map((opt: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 capitalize">{opt.mode}</td>
                      <td className="py-3 text-right font-semibold">{formatCurrency(opt.cost)}</td>
                      <td className="py-3 text-right text-gray-500">{opt.time}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
