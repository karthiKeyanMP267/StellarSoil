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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 backdrop-blur-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Welcome to {user?.farmName || user?.name + "'s Farm"}
          </h1>
          {user?.farmType && (
            <p className="mt-1 text-lg text-green-600 font-semibold">{user.farmType}</p>
          )}
          <p className="mt-2 text-gray-600">Here's an overview of your practice</p>
        </div>        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-600 truncate">Total Products</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.totalProducts}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-600 truncate">Active Listings</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.activeListings}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-600 truncate">Completed Orders</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.completedOrders}
              </dd>
            </div>
          </div>
        </div>        {/* Upcoming Appointments Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Active Orders</h2>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">No active orders to fulfill</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Recent Sales</h2>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">No recent sales to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
