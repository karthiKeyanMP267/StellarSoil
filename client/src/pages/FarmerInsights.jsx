import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { components } from '../styles/theme';

const insights = [
  {
    title: 'Market Trends',
    description: 'Stay ahead with real-time market price predictions',
    icon: ArrowTrendingUpIcon,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    title: 'Seasonal Guide',
    description: 'Get personalized crop recommendations based on season',
    icon: CalendarIcon,
    color: 'bg-gradient-to-br from-amber-500 to-yellow-600'
  },
  {
    title: 'Community Hub',
    description: 'Connect and share knowledge with other farmers',
    icon: UserGroupIcon,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }
];

function FarmerInsights() {
  const [selectedInsight, setSelectedInsight] = useState('Market Trends');
  const [marketData] = useState({
    trends: [
      { month: 'Jan', price: 2500 },
      { month: 'Feb', price: 2800 },
      { month: 'Mar', price: 3200 },
      { month: 'Apr', price: 3000 },
      { month: 'May', price: 3500 },
      { month: 'Jun', price: 3800 }
    ],
    recommendations: [
      {
        crop: 'Tomatoes',
        confidence: 85,
        prediction: 'Price expected to rise by 15% in the next month'
      },
      {
        crop: 'Onions',
        confidence: 78,
        prediction: 'Stable prices expected for the next 2 months'
      },
      {
        crop: 'Potatoes',
        confidence: 92,
        prediction: 'High demand forecasted during upcoming festival season'
      }
    ],
    communityTips: [
      {
        author: 'Ravi Kumar',
        tip: 'Using organic mulch has improved my soil quality significantly',
        likes: 45
      },
      {
        author: 'Priya Singh',
        tip: 'Crop rotation with legumes has reduced my fertilizer costs',
        likes: 38
      },
      {
        author: 'Mohan Reddy',
        tip: 'Early morning irrigation is giving better yields',
        likes: 52
      }
    ]
  });

  const renderContent = () => {
    switch (selectedInsight) {
      case 'Market Trends':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marketData.recommendations.map((rec) => (
                <div key={rec.crop} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{rec.crop}</h4>
                    <span className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                      {rec.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-gray-600">{rec.prediction}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold mb-4">Price History</h3>
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                [Price Chart Placeholder]
              </div>
            </div>
          </div>
        );

      case 'Seasonal Guide':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold mb-4">Current Season Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <LightBulbIcon className="h-6 w-6 text-amber-600" />
                    <h4 className="font-medium text-amber-900">Best Crops to Plant</h4>
                  </div>
                  <ul className="space-y-2 text-amber-800">
                    <li>• Wheat (High yield potential)</li>
                    <li>• Mustard (Good market demand)</li>
                    <li>• Peas (Favorable conditions)</li>
                  </ul>
                </div>
                {/* Add more seasonal insights */}
              </div>
            </div>
          </div>
        );

      case 'Community Hub':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold mb-4">Farmer Tips & Insights</h3>
              <div className="space-y-4">
                {marketData.communityTips.map((tip, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-blue-900">{tip.tip}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                          <span className="font-medium">{tip.author}</span>
                          <span>•</span>
                          <span>{tip.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
            Farmer Insights
          </h1>
          <p className="mt-2 text-gray-600">
            Make data-driven decisions with our smart farming insights
          </p>
        </div>

        {/* Insights Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight) => (
            <button
              key={insight.title}
              className={`relative overflow-hidden rounded-2xl p-6 text-white ${insight.color} hover:shadow-lg transition-all duration-300 ${
                selectedInsight === insight.title ? 'ring-2 ring-offset-2 ring-green-500' : ''
              }`}
              onClick={() => setSelectedInsight(insight.title)}
            >
              <div className="relative z-10">
                <insight.icon className="h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm opacity-90">{insight.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default FarmerInsights;
