import React, { useState, useEffect, useCallback } from 'react';
import { ChartBarIcon, TrendingUpIcon, CurrencyDollarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import { mlApi } from '../api/mlApi';
import { toast } from 'react-toastify';

const PricePrediction = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [priceFactors, setPriceFactors] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available crops
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await mlApi.getAvailableCrops();
        if (data.success) {
          setCrops(data.crops);
        }
      } catch (err) {
        console.error('Error fetching crops:', err);
        toast.error('Failed to load available crops');
      }
    };

    fetchCrops();
  }, []);

  const fetchPredictions = useCallback(async () => {
    if (!selectedCrop) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch predictions and factors in parallel
      const [predictionData, factorsData] = await Promise.all([
        mlApi.getPricePrediction(selectedCrop, 30),
        mlApi.getPriceFactors(selectedCrop)
      ]);

      if (predictionData.success) {
        setPredictions(predictionData);
      } else {
        throw new Error(predictionData.message || 'Failed to fetch predictions');
      }

      if (factorsData.success) {
        setPriceFactors(factorsData.factors);
      }
    } catch (err) {
      console.error('Error fetching predictions:', err);
      const errorMessage = err.message || 'Failed to fetch price predictions. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedCrop]);

  useEffect(() => {
    if (selectedCrop) {
      fetchPredictions();
    }
  }, [selectedCrop, fetchPredictions]);

  // Process data for chart
  const processChartData = useCallback(() => {
    if (!predictions?.predictions?.length) return null;

    const labels = predictions.predictions.map(p => p.date);
    const prices = predictions.predictions.map(p => p.price);
    const lowerBounds = predictions.predictions.map(p => p.lower_bound);
    const upperBounds = predictions.predictions.map(p => p.upper_bound);

    return {
      labels,
      datasets: [
        {
          label: 'Predicted Price (₹/kg)',
          data: prices,
          borderColor: 'rgb(34, 197, 94)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Lower Bound',
          data: lowerBounds,
          borderColor: 'rgba(156, 163, 175, 0.5)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          tension: 0.1,
          fill: false,
          borderDash: [5, 5]
        },
        {
          label: 'Upper Bound',
          data: upperBounds,
          borderColor: 'rgba(156, 163, 175, 0.5)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          tension: 0.1,
          fill: '-1', // Fill between upper and lower bound
          borderDash: [5, 5]
        }
      ]
    };
  }, [predictions]);

  const chartData = processChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price Prediction Trend'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (₹/kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center py-12 text-red-600">
      <ExclamationCircleIcon className="h-6 w-6 mr-2" />
      <span>{message}</span>
    </div>
  );

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
        <div className="flex gap-4">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a crop</option>
            {crops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
          <button
            onClick={fetchPredictions}
            disabled={!selectedCrop || loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && predictions && (
        <>
          {/* Current Price and Prediction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-green-800">Current Price</h3>
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">
                ₹{predictions.predictions[0]?.price?.toFixed(2)}/kg
              </p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-amber-800">Predicted High</h3>
                <TrendingUpIcon className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-900 mt-2">
                ₹{Math.max(...predictions.predictions.map(p => p.price))?.toFixed(2)}/kg
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-orange-800">Average Price</h3>
                <span className="text-sm font-medium text-orange-600">
                  {predictions.average_price?.toFixed(2)} ₹/kg
                </span>
              </div>
              <div className="mt-4 text-sm text-orange-600">
                Confidence Interval: ±₹{predictions.confidence_interval?.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Price Trend Chart */}
          {chartData && (
            <div className="mb-8 bg-white p-4 rounded-lg border">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Impact Factors */}
          {priceFactors?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Impact Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priceFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        factor.impact === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : factor.impact === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {factor.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PricePrediction;
