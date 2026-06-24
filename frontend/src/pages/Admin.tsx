import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface AdminStats {
  totalUsers: number;
  totalTrips: number;
  totalSearches: number;
}

interface PopularRoute {
  source: string;
  destination: string;
  count: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminAPI.getDashboard();
      if (res.success) {
        setStats(res.stats);
        setPopularRoutes(res.popularRoutes || []);
      }
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-500">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{stats?.totalUsers || 0}</div>
          <div className="text-gray-500 text-sm">Total Users</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{stats?.totalTrips || 0}</div>
          <div className="text-gray-500 text-sm">Saved Trips</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">{stats?.totalSearches || 0}</div>
          <div className="text-gray-500 text-sm">Total Searches</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Routes</h2>
        {popularRoutes.length === 0 ? (
          <p className="text-gray-400">No route data available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Destination</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Searches</th>
                </tr>
              </thead>
              <tbody>
                {popularRoutes.map((route, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">{route.source}</td>
                    <td className="py-3 px-4">{route.destination}</td>
                    <td className="py-3 px-4 text-right font-semibold">{route.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
