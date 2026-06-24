import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { tripsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatDate, formatDistance, truncateText } from '../utils/helpers';

interface Trip {
  _id: string;
  title: string;
  source: { name: string };
  destination: { name: string };
  travelDate: string;
  returnDate?: string;
  travelers: number;
  route: { distance: number };
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await tripsAPI.getAll();
      setTrips(res.trips || []);
    } catch {
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripsAPI.delete(id);
      setTrips(trips.filter((t) => t._id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}! You have {trips.length} saved trip{trips.length !== 1 ? 's' : ''}.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-4 w-3/4 mb-3" />
              <div className="skeleton h-3 w-1/2 mb-2" />
              <div className="skeleton h-3 w-2/3 mb-2" />
              <div className="skeleton h-8 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No trips yet</h2>
          <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
          <Link to="/" className="btn-primary inline-flex">Plan a Trip</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden card-hover"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>📅 {formatDate(trip.createdAt)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{truncateText(trip.title, 40)}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span>{trip.source?.name || 'N/A'}</span>
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  <span>{trip.destination?.name || 'N/A'}</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-400 mt-2">
                  {trip.route?.distance && <span>📏 {formatDistance(trip.route.distance)}</span>}
                  {trip.travelers && <span>👥 {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>}
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <Link to={`/trips/${trip._id}`} className="flex-1 py-3 text-center text-blue-600 font-medium hover:bg-blue-50 transition-colors text-sm">View Details</Link>
                <button onClick={() => handleDelete(trip._id)} className="flex-1 py-3 text-center text-red-500 font-medium hover:bg-red-50 transition-colors text-sm">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
