import { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import FarmProfile from './FarmProfile';

export default function FarmDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeListings: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/farms/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching farm stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    // Check if farm profile is incomplete (e.g., no description or location)
    if (user?.role === 'farmer' && (!user.farmDescription || !user.location)) {
      setShowProfile(true);
    }
  }, [user]);

  if (showProfile) {
    return <FarmProfile onComplete={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/20 p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Welcome to {user?.farmName || user?.name + "'s Farm"}
          </h1>
          {user?.farmType && (
            <p className="mt-1 text-lg text-amber-700 font-semibold">{user.farmType}</p>
          )}
          <p className="mt-2 text-amber-600">Here's an overview of your practice</p>
        </div>        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl border border-amber-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-amber-700 truncate">Total Products</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.totalProducts}
              </dd>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl border border-amber-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-amber-700 truncate">Active Listings</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.activeListings}
              </dd>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl border border-amber-200/20 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-amber-700 truncate">Completed Orders</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.completedOrders}
              </dd>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/20 p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">Active Orders</h2>
            <div className="bg-amber-50 rounded-xl p-8 text-center">
              <p className="text-amber-700">No active orders to fulfill</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/20 p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">Recent Sales</h2>
            <div className="bg-amber-50 rounded-xl p-8 text-center">
              <p className="text-amber-700">No recent sales to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
