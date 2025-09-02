import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  SparklesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  MapPinIcon,
  SparklesIcon as LeafIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MarketDemandForecasting = ({ farmerId }) => {
  const [selectedCrop, setSelectedCrop] = useState('tomatoes');
  const [timeframe, setTimeframe] = useState('6months');
  const [forecastData, setForecastData] = useState({});
  const [marketInsights, setMarketInsights] = useState([]);
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecastData();
  }, [selectedCrop, timeframe]);

  const loadForecastData = () => {
    // Simulate market demand forecasting data
    const mockForecastData = {
      tomatoes: {
        currentPrice: 4.50,
        predictedPrice: 5.20,
        priceChange: 15.6,
        demand: {
          current: 85,
          predicted: 92,
          trend: 'increasing'
        },
        supply: {
          current: 78,
          predicted: 82,
          trend: 'stable'
        },
        seasonality: {
          peak: 'July-September',
          low: 'December-February'
        },
        competitors: 12,
        marketShare: 8.5,
        historicalData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          prices: [3.20, 3.40, 3.80, 4.20, 4.50, 4.80, 5.50, 5.20, 4.90, 4.30, 3.60, 3.20],
          demand: [60, 65, 70, 75, 80, 85, 95, 90, 85, 75, 65, 60],
          supply: [70, 75, 72, 78, 80, 82, 88, 85, 83, 78, 72, 70]
        },
        forecast: {
          labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
          prices: [4.90, 4.30, 3.60, 3.20, 3.40, 3.80],
          demand: [85, 75, 65, 60, 65, 70],
          confidence: [95, 92, 88, 85, 82, 78]
        }
      }
    };

    const mockInsights = [
      {
        id: 1,
        type: 'opportunity',
        title: 'High Demand Window',
        description: 'Tomato demand expected to peak in next 2 months due to seasonal factors',
        impact: 'high',
        timeframe: '2 months',
        confidence: 89
      },
      {
        id: 2,
        type: 'warning',
        title: 'Supply Increase Alert',
        description: 'Local competitors planning to increase tomato production by 15%',
        impact: 'medium',
        timeframe: '3 months',
        confidence: 76
      },
      {
        id: 3,
        type: 'trend',
        title: 'Organic Premium',
        description: 'Organic tomatoes commanding 25% price premium in local market',
        impact: 'high',
        timeframe: 'ongoing',
        confidence: 94
      }
    ];

    const mockRecommendations = [
      {
        id: 1,
        crop: 'Cherry Tomatoes',
        reason: 'Growing demand in local restaurants',
        potentialRevenue: 8200,
        plantingWindow: 'Next 2 weeks',
        confidence: 92,
        riskLevel: 'low'
      },
      {
        id: 2,
        crop: 'Organic Lettuce',
        reason: 'Low local supply, high demand',
        potentialRevenue: 6500,
        plantingWindow: 'Next month',
        confidence: 88,
        riskLevel: 'medium'
      },
      {
        id: 3,
        crop: 'Bell Peppers',
        reason: 'Price uptrend predicted',
        potentialRevenue: 7800,
        plantingWindow: '6 weeks',
        confidence: 85,
        riskLevel: 'low'
      }
    ];

    const mockAlerts = [
      {
        id: 1,
        type: 'price_target',
        message: 'Tomato prices reached your target of $5.00/lb',
        timestamp: '2025-08-28T14:30:00Z',
        action: 'Consider harvesting early crop'
      },
      {
        id: 2,
        type: 'demand_spike',
        message: 'Unexpected 20% demand increase for organic produce',
        timestamp: '2025-08-28T10:15:00Z',
        action: 'Adjust pricing strategy'
      }
    ];

    setForecastData(mockForecastData);
    setMarketInsights(mockInsights);
    setCropRecommendations(mockRecommendations);
    setPriceAlerts(mockAlerts);
    setLoading(false);
  };

  const crops = [
    { id: 'tomatoes', name: 'Tomatoes', icon: '🍅' },
    { id: 'lettuce', name: 'Lettuce', icon: '🥬' },
    { id: 'peppers', name: 'Bell Peppers', icon: '🫑' },
    { id: 'carrots', name: 'Carrots', icon: '🥕' },
    { id: 'onions', name: 'Onions', icon: '🧅' }
  ];

  const currentCropData = forecastData[selectedCrop] || {};

  // Chart configurations
  const priceHistoryData = {
    labels: currentCropData.historicalData?.labels || [],
    datasets: [
      {
        label: 'Historical Prices ($/lb)',
        data: currentCropData.historicalData?.prices || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const demandSupplyData = {
    labels: currentCropData.historicalData?.labels || [],
    datasets: [
      {
        label: 'Demand %',
        data: currentCropData.historicalData?.demand || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Supply %',
        data: currentCropData.historicalData?.supply || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  };

  const forecastConfidenceData = {
    labels: currentCropData.forecast?.labels || [],
    datasets: [
      {
        label: 'Predicted Prices',
        data: currentCropData.forecast?.prices || [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4
      },
      {
        label: 'Confidence %',
        data: currentCropData.forecast?.confidence || [],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'opportunity': return 'text-green-600 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'trend': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-beige-200"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-beige-200 rounded w-1/2"></div>
          <div className="h-4 bg-beige-100 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-beige-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg"
          >
            <ChartBarIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Market Demand Forecasting</h2>
            <p className="text-beige-600 font-medium">Predictive analytics for smart crop planning</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full border border-blue-200"
        >
          <SparklesIcon className="h-5 w-5 text-blue-600" />
          <span className="text-blue-700 font-semibold">AI Forecasting</span>
        </motion.div>
      </div>

      {/* Price Alerts */}
      {priceAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-8"
        >
          <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Market Alerts
          </h3>
          <div className="space-y-3">
            {priceAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white/60 rounded-xl p-4"
              >
                <div>
                  <p className="font-medium text-blue-700">{alert.message}</p>
                  <p className="text-sm text-blue-600">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-700">Recommended Action:</p>
                  <p className="text-sm text-blue-600">{alert.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white/60 rounded-2xl border border-beige-200">
        <div className="flex items-center space-x-2">
          <label className="text-earth-600 font-medium">Crop:</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-beige-200 text-earth-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {crops.map(crop => (
              <option key={crop.id} value={crop.id}>
                {crop.icon} {crop.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-earth-600 font-medium">Forecast Period:</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-beige-200 text-earth-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="1year">1 Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Current Price</p>
              <p className="text-3xl font-bold text-green-700">${currentCropData.currentPrice}</p>
              <p className="text-sm text-green-600">per lb</p>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Predicted Price</p>
              <p className="text-3xl font-bold text-blue-700">${currentCropData.predictedPrice}</p>
              <div className="flex items-center text-sm">
                {currentCropData.priceChange > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={currentCropData.priceChange > 0 ? 'text-green-600' : 'text-red-600'}>
                  {currentCropData.priceChange > 0 ? '+' : ''}{currentCropData.priceChange}%
                </span>
              </div>
            </div>
            <ArrowTrendingUpIcon className="h-12 w-12 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-semibold">Demand Level</p>
              <p className="text-3xl font-bold text-purple-700">{currentCropData.demand?.predicted}%</p>
              <p className="text-sm text-purple-600 capitalize">{currentCropData.demand?.trend}</p>
            </div>
            <ShoppingCartIcon className="h-12 w-12 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-semibold">Market Share</p>
              <p className="text-3xl font-bold text-orange-700">{currentCropData.marketShare}%</p>
              <p className="text-sm text-orange-600">{currentCropData.competitors} competitors</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Price History */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4">Price History & Forecast</h3>
          <Line data={forecastConfidenceData} options={chartOptions} />
        </motion.div>

        {/* Demand vs Supply */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4">Demand vs Supply Analysis</h3>
          <Bar data={demandSupplyData} />
        </motion.div>
      </div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200 mb-8"
      >
        <h3 className="text-xl font-bold text-earth-700 mb-4">Market Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {marketInsights.map((insight) => (
            <motion.div
              key={insight.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-2 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{insight.title}</h4>
                <span className="text-xs px-2 py-1 bg-white/60 rounded-full">
                  {insight.confidence}% confidence
                </span>
              </div>
              <p className="text-sm mb-3">{insight.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span>Impact: {insight.impact}</span>
                <span>{insight.timeframe}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Crop Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200"
      >
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <LightBulbIcon className="h-6 w-6 mr-2" />
          AI Crop Recommendations
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {cropRecommendations.map((rec) => (
            <motion.div
              key={rec.id}
              whileHover={{ y: -5 }}
              className="bg-white/80 rounded-xl p-6 border border-green-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-green-700">{rec.crop}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(rec.riskLevel)}`}>
                  {rec.riskLevel} risk
                </span>
              </div>
              
              <p className="text-green-600 text-sm mb-4">{rec.reason}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Potential Revenue:</span>
                  <span className="font-semibold text-green-700">${rec.potentialRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Plant by:</span>
                  <span className="font-semibold text-green-700">{rec.plantingWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Confidence:</span>
                  <span className="font-semibold text-green-700">{rec.confidence}%</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center"
              >
                Plan Crop
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarketDemandForecasting;
