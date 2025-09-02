import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  SparklesIcon as LeafIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  ClockIcon,
  MapPinIcon,
  BeakerIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon as WaterDropIcon,
  ArrowPathIcon as RecycleIcon,
  BoltIcon,
  GlobeAltIcon as TreePineIcon
} from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SustainabilityScoreTracker = ({ farmId }) => {
  const [sustainabilityData, setSustainabilityData] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [carbonFootprint, setCarbonFootprint] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSustainabilityData();
  }, [farmId]);

  const loadSustainabilityData = () => {
    // Simulate sustainability tracking data
    const mockSustainabilityData = {
      overallScore: 85,
      categories: {
        waterUsage: {
          score: 88,
          metrics: {
            efficiency: 92,
            conservation: 85,
            recycling: 78
          },
          trend: 'improving',
          impact: 'high'
        },
        soilHealth: {
          score: 91,
          metrics: {
            organicMatter: 94,
            erosionControl: 89,
            biodiversity: 90
          },
          trend: 'stable',
          impact: 'high'
        },
        energyUse: {
          score: 78,
          metrics: {
            renewable: 82,
            efficiency: 75,
            carbonNeutral: 77
          },
          trend: 'improving',
          impact: 'medium'
        },
        biodiversity: {
          score: 87,
          metrics: {
            nativeSpecies: 90,
            pollinator: 85,
            habitatPreservation: 86
          },
          trend: 'improving',
          impact: 'high'
        },
        wasteManagement: {
          score: 82,
          metrics: {
            reduction: 85,
            recycling: 80,
            composting: 81
          },
          trend: 'stable',
          impact: 'medium'
        },
        chemicalUse: {
          score: 93,
          metrics: {
            organic: 95,
            reduction: 92,
            alternatives: 91
          },
          trend: 'improving',
          impact: 'high'
        }
      },
      monthlyTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        scores: [82, 83, 84, 85, 86, 85, 84, 85]
      }
    };

    const mockCertifications = [
      {
        id: 1,
        name: 'USDA Organic',
        status: 'certified',
        validUntil: '2026-03-15',
        score: 95,
        icon: '🌿',
        description: 'Certified organic farming practices'
      },
      {
        id: 2,
        name: 'Carbon Neutral Farm',
        status: 'in_progress',
        expectedDate: '2025-12-01',
        score: 78,
        icon: '🌍',
        description: 'Working towards carbon neutral operations'
      },
      {
        id: 3,
        name: 'Water Stewardship',
        status: 'certified',
        validUntil: '2025-11-20',
        score: 88,
        icon: '💧',
        description: 'Sustainable water management practices'
      },
      {
        id: 4,
        name: 'Pollinator Friendly',
        status: 'eligible',
        expectedDate: '2025-10-15',
        score: 87,
        icon: '🐝',
        description: 'Supporting bee and pollinator populations'
      }
    ];

    const mockImprovements = [
      {
        id: 1,
        category: 'energyUse',
        title: 'Install Solar Panels',
        description: 'Add 50kW solar panel system to reduce grid dependency',
        impact: 15,
        cost: 75000,
        paybackPeriod: '4 years',
        carbonReduction: 25,
        difficulty: 'medium',
        priority: 'high'
      },
      {
        id: 2,
        category: 'waterUsage',
        title: 'Drip Irrigation Upgrade',
        description: 'Replace sprinkler system with precision drip irrigation',
        impact: 12,
        cost: 25000,
        paybackPeriod: '2 years',
        waterSavings: 30,
        difficulty: 'low',
        priority: 'high'
      },
      {
        id: 3,
        category: 'wasteManagement',
        title: 'Composting System',
        description: 'Implement advanced composting for organic waste',
        impact: 8,
        cost: 15000,
        paybackPeriod: '3 years',
        wasteReduction: 40,
        difficulty: 'low',
        priority: 'medium'
      },
      {
        id: 4,
        category: 'biodiversity',
        title: 'Pollinator Gardens',
        description: 'Create dedicated pollinator habitat areas',
        impact: 10,
        cost: 5000,
        paybackPeriod: '1 year',
        biodiversityIncrease: 20,
        difficulty: 'low',
        priority: 'medium'
      }
    ];

    const mockCarbonFootprint = {
      totalEmissions: 125.5, // tons CO2 per year
      breakdown: {
        energy: 45.2,
        transportation: 28.7,
        fertilizers: 31.1,
        machinery: 20.5
      },
      offset: 38.2,
      netEmissions: 87.3,
      target: 50.0,
      reduction: 22.3 // % reduction from baseline
    };

    setSustainabilityData(mockSustainabilityData);
    setCertifications(mockCertifications);
    setImprovements(mockImprovements);
    setCarbonFootprint(mockCarbonFootprint);
    setLoading(false);
  };

  const categories = [
    { id: 'overall', name: 'Overall', icon: ChartBarIcon, color: 'blue' },
    { id: 'waterUsage', name: 'Water', icon: WaterDropIcon, color: 'cyan' },
    { id: 'soilHealth', name: 'Soil', icon: LeafIcon, color: 'green' },
    { id: 'energyUse', name: 'Energy', icon: BoltIcon, color: 'yellow' },
    { id: 'biodiversity', name: 'Biodiversity', icon: TreePineIcon, color: 'emerald' },
    { id: 'wasteManagement', name: 'Waste', icon: RecycleIcon, color: 'purple' },
    { id: 'chemicalUse', name: 'Chemicals', icon: BeakerIcon, color: 'orange' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981'; // green
    if (score >= 80) return '#F59E0B'; // yellow
    if (score >= 70) return '#EF4444'; // red
    return '#6B7280'; // gray
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'certified': return 'text-green-600 bg-green-100 border-green-200';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'eligible': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
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
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-earth-700">Sustainability Score Tracker</h2>
            <p className="text-beige-600 font-medium">Environmental impact monitoring and certification tracking</p>
          </div>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200"
        >
          <SparklesIcon className="h-5 w-5 text-green-600" />
          <span className="text-green-700 font-semibold">Eco-Certified</span>
        </motion.div>
      </div>

      {/* Overall Score Dashboard */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="col-span-1 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 text-center"
        >
          <h3 className="text-lg font-semibold text-green-700 mb-4">Overall Score</h3>
          <div className="w-24 h-24 mx-auto mb-4">
            <CircularProgressbar
              value={sustainabilityData.overallScore}
              text={`${sustainabilityData.overallScore}%`}
              styles={buildStyles({
                textColor: '#10B981',
                pathColor: '#10B981',
                trailColor: '#D1FAE5'
              })}
            />
          </div>
          <p className="text-green-600 text-sm">Excellent sustainability rating</p>
        </motion.div>

        <div className="col-span-3">
          <h3 className="text-lg font-semibold text-earth-700 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(sustainabilityData.categories || {}).map(([key, data]) => {
              const category = categories.find(c => c.id === key);
              if (!category) return null;
              
              return (
                <motion.div
                  key={key}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedCategory === key 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-beige-200 bg-white/60 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <category.icon className="h-5 w-5 text-earth-600" />
                    <span className={`text-sm font-bold ${
                      data.score >= 90 ? 'text-green-600' :
                      data.score >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {data.score}%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-earth-700">{category.name}</p>
                  <p className={`text-xs ${
                    data.trend === 'improving' ? 'text-green-600' :
                    data.trend === 'declining' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {data.trend}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carbon Footprint Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-8"
      >
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <CloudIcon className="h-6 w-6 mr-2" />
          Carbon Footprint Analysis
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-blue-600 font-medium">Total Emissions</p>
            <p className="text-3xl font-bold text-blue-700">{carbonFootprint.totalEmissions}</p>
            <p className="text-blue-600 text-sm">tons CO₂/year</p>
          </div>
          
          <div className="text-center">
            <p className="text-blue-600 font-medium">Carbon Offset</p>
            <p className="text-3xl font-bold text-green-700">{carbonFootprint.offset}</p>
            <p className="text-green-600 text-sm">tons CO₂/year</p>
          </div>
          
          <div className="text-center">
            <p className="text-blue-600 font-medium">Net Emissions</p>
            <p className="text-3xl font-bold text-orange-700">{carbonFootprint.netEmissions}</p>
            <p className="text-orange-600 text-sm">tons CO₂/year</p>
          </div>
          
          <div className="text-center">
            <p className="text-blue-600 font-medium">Reduction</p>
            <p className="text-3xl font-bold text-green-700">{carbonFootprint.reduction}%</p>
            <p className="text-green-600 text-sm">from baseline</p>
          </div>
        </div>
        
        <div className="mt-6 bg-white/60 p-4 rounded-xl">
          <h4 className="font-semibold text-blue-700 mb-3">Emissions Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(carbonFootprint.breakdown || {}).map(([source, value]) => (
              <div key={source} className="text-center">
                <div className="text-lg font-bold text-blue-700">{value}</div>
                <div className="text-sm text-blue-600 capitalize">{source}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-beige-200 mb-8"
      >
        <h3 className="text-xl font-bold text-earth-700 mb-4 flex items-center">
          <TrophyIcon className="h-6 w-6 mr-2 text-yellow-600" />
          Sustainability Certifications
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ y: -5 }}
              className={`p-4 rounded-xl border-2 ${getStatusColor(cert.status)}`}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{cert.icon}</div>
                <h4 className="font-semibold">{cert.name}</h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold capitalize">{cert.status.replace('_', ' ')}</span>
                </div>
                
                {cert.validUntil && (
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-semibold">
                      {new Date(cert.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {cert.expectedDate && (
                  <div className="flex justify-between">
                    <span>Expected:</span>
                    <span className="font-semibold">
                      {new Date(cert.expectedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-semibold">{cert.score}%</span>
                </div>
              </div>
              
              <p className="text-xs mt-3 opacity-75">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Improvement Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200"
      >
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2" />
          Sustainability Improvements
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {improvements.map((improvement) => (
            <motion.div
              key={improvement.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 rounded-xl p-6 border border-green-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-green-700">{improvement.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(improvement.priority)}`}>
                  {improvement.priority} priority
                </span>
              </div>
              
              <p className="text-green-600 text-sm mb-4">{improvement.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-green-600">Score Impact:</span>
                  <div className="font-semibold text-green-700">+{improvement.impact} points</div>
                </div>
                <div>
                  <span className="text-green-600">Investment:</span>
                  <div className="font-semibold text-green-700">${improvement.cost.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-green-600">Payback:</span>
                  <div className="font-semibold text-green-700">{improvement.paybackPeriod}</div>
                </div>
                <div>
                  <span className="text-green-600">Difficulty:</span>
                  <div className="font-semibold text-green-700 capitalize">{improvement.difficulty}</div>
                </div>
              </div>
              
              {improvement.carbonReduction && (
                <div className="flex items-center text-sm mb-4">
                  <CloudIcon className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-green-600">-{improvement.carbonReduction}% carbon emissions</span>
                </div>
              )}
              
              {improvement.waterSavings && (
                <div className="flex items-center text-sm mb-4">
                  <WaterDropIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-600">-{improvement.waterSavings}% water usage</span>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold"
              >
                Plan Implementation
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SustainabilityScoreTracker;
