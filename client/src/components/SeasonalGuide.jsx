import React, { useState, useEffect } from 'react';
import { CalendarIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const SeasonalGuide = () => {
  const [season, setSeason] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Determine current season based on date and location
    determineSeason();
  }, []);

  const determineSeason = () => {
    const month = new Date().getMonth();
    // India-specific seasons
    if (month >= 2 && month <= 5) setSeason('summer');
    else if (month >= 6 && month <= 9) setSeason('monsoon');
    else setSeason('winter');

    // Get recommendations based on season
    fetchRecommendations(season);
  };

  const fetchRecommendations = async (currentSeason) => {
    // This would connect to your AI service for recommendations
    // For now, using static data
    const seasonalCrops = {
      summer: [
        { name: 'Tomatoes', confidence: 0.95, price_trend: 'rising' },
        { name: 'Okra', confidence: 0.92, price_trend: 'stable' },
        { name: 'Mangoes', confidence: 0.98, price_trend: 'rising' },
      ],
      monsoon: [
        { name: 'Rice', confidence: 0.97, price_trend: 'stable' },
        { name: 'Green Chilies', confidence: 0.90, price_trend: 'rising' },
        { name: 'Leafy Greens', confidence: 0.94, price_trend: 'stable' },
      ],
      winter: [
        { name: 'Carrots', confidence: 0.96, price_trend: 'stable' },
        { name: 'Cauliflower', confidence: 0.93, price_trend: 'rising' },
        { name: 'Green Peas', confidence: 0.91, price_trend: 'stable' },
      ],
    };

    setRecommendations(seasonalCrops[currentSeason] || []);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Seasonal Guide</h2>
        <CalendarIcon className="h-8 w-8 text-green-600" />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Season: <span className="text-green-600 capitalize">{season}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((crop, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{crop.name}</h4>
                <LightBulbIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Confidence: {(crop.confidence * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">
                  Price Trend:{' '}
                  <span className={crop.price_trend === 'rising' ? 'text-green-600' : 'text-blue-600'}>
                    {crop.price_trend}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-green-800 mb-2">Tips for {season}</h3>
        <ul className="list-disc list-inside text-green-700 space-y-2">
          {season === 'summer' && (
            <>
              <li>Focus on heat-resistant varieties</li>
              <li>Implement proper irrigation systems</li>
              <li>Consider greenhouse cultivation for sensitive crops</li>
            </>
          )}
          {season === 'monsoon' && (
            <>
              <li>Ensure proper drainage systems</li>
              <li>Use disease-resistant varieties</li>
              <li>Monitor soil moisture levels</li>
            </>
          )}
          {season === 'winter' && (
            <>
              <li>Protect crops from frost</li>
              <li>Utilize row covers when needed</li>
              <li>Plan for winter-specific vegetables</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SeasonalGuide;
