import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/api';
import { components } from '../styles/theme';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  SparklesIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    dailyOrders: [],
    topProducts: [],
    activeUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalFarms: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await API.get('/admin/analytics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statsCards = [
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: '+12%',
      color: 'from-beige-500 to-earth-500',
      bgColor: 'from-beige-50 to-earth-50',
      iconBg: 'bg-gradient-to-r from-beige-500 to-earth-500'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCartIcon,
      change: '+8%',
      color: 'from-sage-500 to-beige-500',
      bgColor: 'from-sage-50 to-beige-50',
      iconBg: 'bg-gradient-to-r from-sage-500 to-beige-500'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: UserGroupIcon,
      change: '+15%',
      color: 'from-cream-500 to-sage-500',
      bgColor: 'from-cream-50 to-sage-50',
      iconBg: 'bg-gradient-to-r from-cream-500 to-sage-500'
    },
    {
      name: 'Total Farms',
      value: stats.totalFarms.toLocaleString(),
      icon: ChartPieIcon,
      change: '+5%',
      color: 'from-earth-500 to-beige-500',
      bgColor: 'from-earth-50 to-beige-50',
      iconBg: 'bg-gradient-to-r from-earth-500 to-beige-500'
    }
  ];

  const orderData = {
    labels: stats.dailyOrders.map(day => day.date),
    datasets: [
      {
        label: 'Daily Orders',
        data: stats.dailyOrders.map(day => day.count),
        borderColor: '#5a8a5a',
        backgroundColor: 'rgba(90, 138, 90, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#efc373',
        pointBorderColor: '#5a8a5a',
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const productData = {
    labels: stats.topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Sales Volume',
        data: stats.topProducts.map(product => product.sales),
        backgroundColor: [
          'rgba(239, 195, 115, 0.8)',
          'rgba(90, 138, 90, 0.8)',
          'rgba(247, 213, 114, 0.8)',
          'rgba(157, 121, 85, 0.8)',
          'rgba(239, 195, 115, 0.6)'
        ],
        borderColor: [
          '#efc373',
          '#5a8a5a',
          '#f7d572',
          '#9d7955',
          '#efc373'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
      >
        <div className="flex items-center justify-center p-8 min-h-[60vh]">
          <motion.div 
            className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-beige-200"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="relative mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 border-4 border-beige-200 border-t-beige-600 rounded-full shadow-lg mx-auto"></div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ChartBarIcon className="w-6 h-6 text-beige-600" />
              </motion.div>
            </motion.div>
            <h3 className="text-xl font-semibold text-beige-800 mb-2">Loading Analytics...</h3>
            <p className="text-beige-600">Fetching the latest performance data</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-beige-600 to-earth-600 rounded-3xl p-8 shadow-xl border border-beige-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div 
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">
                    Analytics Dashboard
                  </h1>
                  <p className="text-beige-100 text-lg">
                    Real-time insights into marketplace performance
                  </p>
                </div>
              </div>
              <motion.button
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : {}}
                  transition={refreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                </motion.div>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 group`}
            >
              <div className="flex items-center">
                <motion.div 
                  className={`${stat.iconBg} p-3 rounded-xl shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-beige-700">{stat.name}</p>
                  <motion.p 
                    className="text-2xl font-bold text-beige-900"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                </motion.div>
                <span className="text-sm text-green-700 font-medium">
                  {stat.change} from last month
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-beige-200/50"
          >
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-beige-500 to-sage-500 rounded-xl mr-3">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-beige-600 to-earth-600 bg-clip-text text-transparent">
                Order Trends
              </h3>
            </div>
            <Line 
              data={orderData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#6B7280',
                      usePointStyle: true,
                      padding: 20
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#efc373',
                    borderWidth: 2,
                    cornerRadius: 12,
                    displayColors: true,
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(239, 195, 115, 0.1)',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(239, 195, 115, 0.1)',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  }
                }
              }}
              height={300}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-beige-200/50"
          >
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-sage-500 to-earth-500 rounded-xl mr-3">
                <ChartPieIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-beige-600 to-earth-600 bg-clip-text text-transparent">
                Top Products
              </h3>
            </div>
            <Bar 
              data={productData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#6B7280',
                      usePointStyle: true,
                      padding: 20
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#5a8a5a',
                    borderWidth: 2,
                    cornerRadius: 12,
                    displayColors: true,
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(90, 138, 90, 0.1)',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(90, 138, 90, 0.1)',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  }
                }
              }}
              height={300}
            />
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-beige-200/50 overflow-hidden"
        >
          <div className="px-6 py-5 bg-gradient-to-r from-beige-100 to-cream-100 border-b border-beige-200">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-beige-500 to-earth-500 rounded-xl mr-3">
                <EyeIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-beige-800">
                Recent Transactions
              </h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-beige-200">
              <thead className="bg-gradient-to-r from-beige-50 to-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-beige-800 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                <AnimatePresence>
                  {stats.recentTransactions.map((transaction, index) => (
                    <motion.tr 
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-beige-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-beige-900">
                        #{transaction.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-beige-700">
                        {transaction.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-beige-900">
                        ₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-beige-600">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {stats.recentTransactions.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div 
                className="p-4 bg-gradient-to-r from-beige-400 to-cream-400 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CalendarDaysIcon className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-beige-800 mb-2">No recent transactions</h3>
              <p className="text-beige-600">Transaction data will appear here as they are processed.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AnalyticsDashboard;
