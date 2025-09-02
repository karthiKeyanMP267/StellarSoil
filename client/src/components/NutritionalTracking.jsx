import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  FireIcon,
  HeartIcon,
  ScaleIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const NutritionalTracking = ({ userPurchases = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [nutritionalData, setNutritionalData] = useState({});
  const [dailyIntake, setDailyIntake] = useState({});
  const [goals, setGoals] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateNutritionalData();
  }, [userPurchases, selectedPeriod]);

  const generateNutritionalData = () => {
    // Simulate nutritional tracking data
    const mockData = {
      dailyCalories: 1850,
      targetCalories: 2000,
      vitamins: {
        vitaminC: { current: 95, target: 90, unit: 'mg' },
        vitaminA: { current: 800, target: 900, unit: 'mcg' },
        vitaminK: { current: 110, target: 120, unit: 'mcg' },
        folate: { current: 350, target: 400, unit: 'mcg' },
        vitaminE: { current: 12, target: 15, unit: 'mg' }
      },
      minerals: {
        iron: { current: 14, target: 18, unit: 'mg' },
        calcium: { current: 950, target: 1000, unit: 'mg' },
        potassium: { current: 3200, target: 3500, unit: 'mg' },
        magnesium: { current: 280, target: 320, unit: 'mg' },
        zinc: { current: 9, target: 11, unit: 'mg' }
      },
      macros: {
        carbs: { current: 230, target: 250, unit: 'g' },
        protein: { current: 85, target: 120, unit: 'g' },
        fiber: { current: 28, target: 25, unit: 'g' },
        healthyFats: { current: 45, target: 65, unit: 'g' }
      },
      weeklyTrend: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        calories: [1920, 1750, 1880, 1950, 1820, 2100, 1850],
        vitamins: [88, 92, 85, 95, 90, 98, 95],
        minerals: [82, 78, 85, 88, 84, 92, 87]
      }
    };

    setNutritionalData(mockData);
    setDailyIntake(mockData);
    setGoals({
      dailyVeggies: { current: 6, target: 8, unit: 'servings' },
      weeklyVariety: { current: 15, target: 20, unit: 'different vegetables' },
      organicPercentage: { current: 85, target: 90, unit: '%' }
    });
    
    setAchievements([
      { id: 1, title: 'Vitamin C Champion', description: 'Exceeded daily Vitamin C goal for 7 days', icon: '🍊', earned: true },
      { id: 2, title: 'Rainbow Eater', description: 'Consumed 5 different colored vegetables', icon: '🌈', earned: true },
      { id: 3, title: 'Fiber Friend', description: 'Met daily fiber goal for 5 consecutive days', icon: '🌾', earned: false },
      { id: 4, title: 'Iron Strong', description: 'Consistent iron intake for 2 weeks', icon: '💪', earned: true }
    ]);
    
    setLoading(false);
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  // Chart configurations
  const vitaminChartData = {
    labels: Object.keys(nutritionalData.vitamins || {}),
    datasets: [{
      label: 'Daily Intake (%)',
      data: Object.values(nutritionalData.vitamins || {}).map(v => (v.current / v.target) * 100),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2
    }]
  };

  const weeklyTrendData = {
    labels: nutritionalData.weeklyTrend?.labels || [],
    datasets: [
      {
        label: 'Calories',
        data: nutritionalData.weeklyTrend?.calories || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Vitamin Score (%)',
        data: nutritionalData.weeklyTrend?.vitamins || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
      },
      title: {
        display: true,
        text: 'Weekly Nutritional Trends'
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-beige-100 rounded-xl"></div>
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
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg"
          >
            <ChartBarIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Nutritional Tracking</h2>
            <p className="text-beige-600 font-medium">Monitor your health journey with fresh produce</p>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-white/60 rounded-2xl p-2">
          {['day', 'week', 'month'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-earth-500 text-white shadow-lg'
                  : 'text-earth-600 hover:bg-beige-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Daily Calories</p>
              <p className="text-3xl font-bold text-green-700">{dailyIntake.dailyCalories}</p>
              <p className="text-sm text-green-600">of {dailyIntake.targetCalories} goal</p>
            </div>
            <FireIcon className="h-12 w-12 text-green-500" />
          </div>
          <div className="mt-4 bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(dailyIntake.dailyCalories, dailyIntake.targetCalories)}%` }}
            ></div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Vitamin Score</p>
              <p className="text-3xl font-bold text-blue-700">92%</p>
              <p className="text-sm text-blue-600">Daily average</p>
            </div>
            <BeakerIcon className="h-12 w-12 text-blue-500" />
          </div>
          <div className="mt-4 bg-blue-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-[92%] transition-all duration-300"></div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-semibold">Variety Score</p>
              <p className="text-3xl font-bold text-purple-700">15</p>
              <p className="text-sm text-purple-600">Different vegetables</p>
            </div>
            <SparklesIcon className="h-12 w-12 text-purple-500" />
          </div>
          <div className="mt-4 bg-purple-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full w-[75%] transition-all duration-300"></div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-semibold">Organic %</p>
              <p className="text-3xl font-bold text-orange-700">85%</p>
              <p className="text-sm text-orange-600">Of purchases</p>
            </div>
            <ShieldCheckIcon className="h-12 w-12 text-orange-500" />
          </div>
          <div className="mt-4 bg-orange-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full w-[85%] transition-all duration-300"></div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Weekly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4">Weekly Nutrition Trends</h3>
          <Line data={weeklyTrendData} options={chartOptions} />
        </motion.div>

        {/* Vitamin Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4">Vitamin Intake Today</h3>
          <Doughnut data={vitaminChartData} />
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Vitamins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
            <BeakerIcon className="h-5 w-5 mr-2 text-earth-600" />
            Vitamins
          </h3>
          <div className="space-y-4">
            {Object.entries(nutritionalData.vitamins || {}).map(([vitamin, data]) => (
              <div key={vitamin} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-earth-600">{vitamin.replace('vitamin', 'Vitamin ')}</span>
                    <span className="text-xs text-beige-600">{data.current}/{data.target} {data.unit}</span>
                  </div>
                  <div className="bg-beige-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(data.current, data.target)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Minerals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
            <ScaleIcon className="h-5 w-5 mr-2 text-earth-600" />
            Minerals
          </h3>
          <div className="space-y-4">
            {Object.entries(nutritionalData.minerals || {}).map(([mineral, data]) => (
              <div key={mineral} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-earth-600 capitalize">{mineral}</span>
                    <span className="text-xs text-beige-600">{data.current}/{data.target} {data.unit}</span>
                  </div>
                  <div className="bg-beige-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(data.current, data.target)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Macronutrients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200"
        >
          <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
            <FireIcon className="h-5 w-5 mr-2 text-earth-600" />
            Macronutrients
          </h3>
          <div className="space-y-4">
            {Object.entries(nutritionalData.macros || {}).map(([macro, data]) => (
              <div key={macro} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-earth-600 capitalize">{macro}</span>
                    <span className="text-xs text-beige-600">{data.current}/{data.target} {data.unit}</span>
                  </div>
                  <div className="bg-beige-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(data.current, data.target)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-200"
      >
        <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
          Nutritional Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                achievement.earned
                  ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-bold text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs">{achievement.description}</p>
                {achievement.earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 inline-flex items-center text-yellow-600"
                  >
                    <TrophyIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs font-semibold">Earned!</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NutritionalTracking;
