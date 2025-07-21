import React, { useState, useEffect } from 'react';
import { ChartBarIcon, TrendingUpIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';

const PricePrediction = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictions, setPredictions] = useState(null);

  const crops = [
    'Tomatoes',
    'Potatoes',
    'Onions',
    'Rice',
    'Wheat',
    'Pulses',
    // Add more crops
  ];

  useEffect(() => {
    if (selectedCrop) {
      fetchPredictions();
    }
  }, [selectedCrop]);

  const fetchPredictions = async () => {
    // In a real implementation, this would call your ML model API
    // For demo, using mock data
    const mockData = {
      currentPrice: 45,
      predictedPrices: [48, 52, 49, 51, 54, 53],
      confidence: 0.85,
      factors: [
        { name: 'Weather', impact: 'positive', confidence: 0.9 },
        { name: 'Supply', impact: 'negative', confidence: 0.75 },
        { name: 'Demand', impact: 'positive', confidence: 0.85 }
      ]
    };
    setPredictions(mockData);
  };

  const chartData = {
    labels: ['Current', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Price Trend (₹/kg)',
        data: predictions ? [predictions.currentPrice, ...predictions.predictedPrices] : [],
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
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
        text: 'Price Prediction Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Smart Price Predictions</h2>
        <ChartBarIcon className="h-8 w-8 text-green-600" />
      </div>

      {/* Crop Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Crop
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Choose a crop</option>
          {crops.map(crop => (
            <option key={crop} value={crop}>{crop}</option>
          ))}
        </select>
      </div>

      {predictions && (
        <>
          {/* Current Price and Prediction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-green-800">Current Price</h3>
                <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">
                ₹{predictions.currentPrice}/kg
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-800">Predicted High</h3>
                <TrendingUpIcon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                ₹{Math.max(...predictions.predictedPrices)}/kg
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-purple-800">Confidence</h3>
                <span className="text-sm font-medium text-purple-600">
                  {(predictions.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${predictions.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Price Trend Chart */}
          <div className="mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Impact Factors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Impact Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.factors.map((factor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{factor.name}</h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      factor.impact === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {factor.impact}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        factor.impact === 'positive' ? 'bg-green-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${factor.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PricePrediction;
