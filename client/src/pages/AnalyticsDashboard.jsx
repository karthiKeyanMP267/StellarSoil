import { useState, useEffect } from 'react';
import API from '../api/api';
import { components } from '../styles/theme';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ShoppingCartIcon
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/admin/analytics');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const statsCards = [
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: '+12%',
      color: 'bg-green-500'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCartIcon,
      change: '+8%',
      color: 'bg-amber-500'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: UserGroupIcon,
      change: '+15%',
      color: 'bg-emerald-500'
    },
    {
      name: 'Total Farms',
      value: stats.totalFarms.toLocaleString(),
      icon: ChartPieIcon,
      change: '+5%',
      color: 'bg-lime-500'
    }
  ];

  const orderData = {
    labels: stats.dailyOrders.map(day => day.date),
    datasets: [
      {
        label: 'Daily Orders',
        data: stats.dailyOrders.map(day => day.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const productData = {
    labels: stats.topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Top Products',
        data: stats.topProducts.map(product => product.sales),
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Overview of your marketplace performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change} from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
              Order Trends
            </h3>
            <Line 
              data={orderData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    padding: 12,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: '#F3F4F6',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  },
                  x: {
                    grid: {
                      color: '#F3F4F6',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  }
                }
              }}
            />
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
              Top Products
            </h3>
            <Bar 
              data={productData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    padding: 12,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: '#F3F4F6',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  },
                  x: {
                    grid: {
                      color: '#F3F4F6',
                    },
                    ticks: {
                      color: '#6B7280',
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-green-100">
          <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{transaction.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
