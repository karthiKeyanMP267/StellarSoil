import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CloudIcon,
  SunIcon,
  BeakerIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PredictiveAnalyticsDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('yield');
  const [timeRange, setTimeRange] = useState('30days');
  const [predictions, setPredictions] = useState({});
  const [insights, setInsights] = useState([]);
  const [alertLevel, setAlertLevel] = useState('normal');

  useEffect(() => {
    generatePredictions();
    generateInsights();
  }, [selectedMetric, timeRange]);

  const generatePredictions = () => {
    const mockPredictions = {
      yield: {
        current: 85,
        predicted: 92,
        confidence: 87,
        trend: 'up',
        factors: ['Weather conditions improving', 'Optimal irrigation timing', 'Soil nutrients at ideal levels']
      },
      revenue: {
        current: 12500,
        predicted: 15800,
        confidence: 91,
        trend: 'up',
        factors: ['Market demand increasing', 'Premium pricing opportunity', 'Seasonal demand peak']
      },
      quality: {
        current: 78,
        predicted: 83,
        confidence: 89,
        trend: 'up',
        factors: ['Disease prevention effective', 'Harvest timing optimization', 'Storage conditions ideal']
      },
      costs: {
        current: 4200,
        predicted: 3900,
        confidence: 85,
        trend: 'down',
        factors: ['Energy efficiency improvements', 'Bulk purchasing savings', 'Automated irrigation savings']
      }
    };
    setPredictions(mockPredictions);
  };

  const generateInsights = () => {
    const mockInsights = [
      {
        id: 1,
        type: 'opportunity',
        priority: 'high',
        title: 'Harvest Window Optimization',
        description: 'AI predicts optimal harvest time in 3-5 days for maximum yield and quality. Weather conditions are ideal.',
        impact: '+12% yield increase',
        confidence: 94,
        timeframe: '3-5 days',
        actionable: true
      },
      {
        id: 2,
        type: 'warning',
        priority: 'medium',
        title: 'Pest Risk Alert',
        description: 'Weather patterns and regional data suggest 65% chance of aphid outbreak in next 2 weeks.',
        impact: 'Potential 15% yield loss',
        confidence: 78,
        timeframe: '2 weeks',
        actionable: true
      },
      {
        id: 3,
        type: 'success',
        priority: 'low',
        title: 'Irrigation Efficiency',
        description: 'Your automated irrigation system is performing 23% better than regional average.',
        impact: '$320 monthly savings',
        confidence: 96,
        timeframe: 'Ongoing',
        actionable: false
      },
      {
        id: 4,
        type: 'opportunity',
        priority: 'high',
        title: 'Market Timing Prediction',
        description: 'Premium market window opens in 10 days. Tomato prices expected to increase by 35%.',
        impact: '+$2,400 revenue potential',
        confidence: 89,
        timeframe: '10 days',
        actionable: true
      }
    ];
    setInsights(mockInsights);
  };

  const metrics = [
    { id: 'yield', name: 'Crop Yield', icon: ChartBarIcon, unit: '%', color: 'green' },
    { id: 'revenue', name: 'Revenue', icon: CurrencyDollarIcon, unit: '$', color: 'blue' },
    { id: 'quality', name: 'Quality Score', icon: BeakerIcon, unit: '%', color: 'purple' },
    { id: 'costs', name: 'Operating Costs', icon: ArrowTrendingDownIcon, unit: '$', color: 'orange' }
  ];

  const timeRanges = [
    { id: '7days', name: '7 Days' },
    { id: '30days', name: '30 Days' },
    { id: '90days', name: '90 Days' },
    { id: '1year', name: '1 Year' }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'opportunity': return LightBulbIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'success': return CheckCircleIcon;
      default: return ClockIcon;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'opportunity': return 'from-yellow-400 to-orange-500';
      case 'warning': return 'from-red-400 to-red-600';
      case 'success': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const currentMetric = predictions[selectedMetric];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <CpuChipIcon className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Predictive Analytics</h2>
              <p className="text-blue-100">AI-powered farming insights and forecasts</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-blue-100">AI Confidence</div>
            <div className="text-2xl font-bold">
              {currentMetric ? currentMetric.confidence : 85}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metric Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Select Metric</h3>
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <motion.button
                  key={range.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeRange === range.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.name}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isSelected = selectedMetric === metric.id;
              const data = predictions[metric.id];
              
              return (
                <motion.button
                  key={metric.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    {data && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        data.trend === 'up' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {data.trend === 'up' ? '↗' : '↘'}
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">{metric.name}</h4>
                  {data && (
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-900">
                        {metric.unit === '$' ? '$' : ''}{data.current.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                      </div>
                      <div className="text-sm text-gray-600">
                        Predicted: {metric.unit === '$' ? '$' : ''}{data.predicted.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detailed Prediction */}
        {currentMetric && (
          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Current vs Predicted */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Forecast Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current</span>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedMetric === 'revenue' || selectedMetric === 'costs' ? '$' : ''}{currentMetric.current.toLocaleString()}{selectedMetric === 'yield' || selectedMetric === 'quality' ? '%' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Predicted</span>
                    <span className={`text-xl font-bold ${currentMetric.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedMetric === 'revenue' || selectedMetric === 'costs' ? '$' : ''}{currentMetric.predicted.toLocaleString()}{selectedMetric === 'yield' || selectedMetric === 'quality' ? '%' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Change</span>
                    <span className={`text-lg font-bold flex items-center ${currentMetric.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`}>
                      {currentMetric.trend === 'up' ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                      {Math.abs(((currentMetric.predicted - currentMetric.current) / currentMetric.current * 100)).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="flex flex-col items-center justify-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Confidence</h4>
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={currentMetric.confidence}
                    text={`${currentMetric.confidence}%`}
                    styles={buildStyles({
                      textSize: '16px',
                      pathColor: currentMetric.confidence >= 80 ? '#22c55e' : currentMetric.confidence >= 60 ? '#f59e0b' : '#ef4444',
                      textColor: '#374151',
                      trailColor: '#e5e7eb'
                    })}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {currentMetric.confidence >= 80 ? 'High confidence' : currentMetric.confidence >= 60 ? 'Medium confidence' : 'Low confidence'}
                </p>
              </div>

              {/* Key Factors */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Key Factors</h4>
                <div className="space-y-2">
                  {currentMetric.factors.map((factor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-blue-200"
                    >
                      <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Insights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">AI-Generated Insights</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Analysis</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl border-2 ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                          insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Impact:</span>
                          <div className="font-medium text-gray-800">{insight.impact}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeframe:</span>
                          <div className="font-medium text-gray-800">{insight.timeframe}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          Confidence: {insight.confidence}%
                        </div>
                        
                        {insight.actionable && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Take Action
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weather Integration */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Impact Analysis</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <SunIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Today</div>
              <div className="font-bold text-gray-800">75°F</div>
              <div className="text-xs text-green-600">Optimal for growth</div>
            </div>
            
            <div className="text-center">
              <CloudIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Tomorrow</div>
              <div className="font-bold text-gray-800">68°F</div>
              <div className="text-xs text-blue-600">Light rain expected</div>
            </div>
            
            <div className="text-center">
              <BeakerIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Soil Moisture</div>
              <div className="font-bold text-gray-800">65%</div>
              <div className="text-xs text-green-600">Ideal level</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictiveAnalyticsDashboard;
