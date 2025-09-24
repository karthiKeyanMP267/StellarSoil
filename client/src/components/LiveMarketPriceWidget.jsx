import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import API from '../api/api';

// Supported by backend model: ['rice','wheat','tomatoes','potatoes','onions']
const cropOptions = ['tomatoes', 'potatoes', 'onions', 'rice', 'wheat'];
const label = (v) => v.charAt(0).toUpperCase() + v.slice(1);

const LiveMarketPriceWidget = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('tomatoes');
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [daysAhead, setDaysAhead] = useState(30);

  const fetchPriceData = async () => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const response = await API.post('/ml/price-prediction', {
        crop: selectedCrop,
        days_ahead: daysAhead
      });
      const data = response.data;
      if (data?.success === false) {
        // Backend may report unsupported crop; fall back to demo data
        throw new Error(data?.error || 'Prediction failed');
      }
      setPriceData(data);
    } catch (err) {
      console.error('Error fetching price predictions:', err);
      // Non-blocking fallback mock data for demo UX
      const mock = {
        success: true,
        crop: selectedCrop,
        current_price: Math.floor(Math.random() * 80) + 20,
        predictions: {
          '7d': Math.floor(Math.random() * 100) + 20,
          '15d': Math.floor(Math.random() * 100) + 20,
          '30d': Math.floor(Math.random() * 100) + 20
        },
        trend: Math.random() > 0.5 ? 'up' : 'down',
        confidence: Math.floor(Math.random() * 30) + 70,
        factors: [
          'Seasonal demand',
          'Supply constraints',
          'Weather patterns'
        ]
      };
      setPriceData(mock);
      setWarning('Live API unavailable; showing demo forecast.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();
  }, [selectedCrop]);

  const renderPriceChange = (current, predicted) => {
    if (!current || !predicted) return null;
    
    const change = predicted - current;
    const percentChange = (change / current) * 100;
    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
        )}
        <span className="font-medium">
          {isPositive ? '+' : ''}{change.toFixed(2)} ({percentChange.toFixed(1)}%)
        </span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-beige-200 shadow-lg overflow-hidden"
    >
      <div className="p-4 bg-gradient-to-r from-beige-50 to-cream-50 border-b border-beige-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChartBarIcon className="h-5 w-5 text-beige-700 mr-2" />
            <h3 className="font-semibold text-beige-800">Live Market Price Predictions</h3>
          </div>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-1.5 text-sm border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>{label(crop)}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            <span className="ml-2 text-beige-600">Loading price data...</span>
          </div>
        ) : priceData ? (
          <div>
            {warning && (
              <div className="p-3 mb-3 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-sm">
                {warning}
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-beige-800">
                  ₹{priceData.current_price}/kg
                </div>
                <div className="text-sm text-beige-500">Current Market Price</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm font-medium text-beige-600">Prediction Confidence</div>
                <div className="flex items-center">
                  <div className="w-24 bg-beige-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${priceData.confidence || 80}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-beige-600">{priceData.confidence || 80}%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-beige-50 rounded-lg">
                <div className="text-sm text-beige-600 mb-1">7-Day Forecast</div>
                <div className="text-lg font-semibold text-beige-800">₹{priceData.predictions['7d']}</div>
                {renderPriceChange(priceData.current_price, priceData.predictions['7d'])}
              </div>
              <div className="p-3 bg-beige-50 rounded-lg">
                <div className="text-sm text-beige-600 mb-1">15-Day Forecast</div>
                <div className="text-lg font-semibold text-beige-800">₹{priceData.predictions['15d']}</div>
                {renderPriceChange(priceData.current_price, priceData.predictions['15d'])}
              </div>
              <div className="p-3 bg-beige-50 rounded-lg">
                <div className="text-sm text-beige-600 mb-1">30-Day Forecast</div>
                <div className="text-lg font-semibold text-beige-800">₹{priceData.predictions['30d']}</div>
                {renderPriceChange(priceData.current_price, priceData.predictions['30d'])}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-beige-600 mb-2">Price Influencing Factors:</div>
              <ul className="text-sm text-beige-700 space-y-1">
                {priceData.factors?.map((factor, index) => (
                  <li key={index} className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
          ) : null
        )}
      </div>
      
      <div className="px-4 py-3 bg-beige-50 border-t border-beige-100 text-xs text-beige-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </motion.div>
  );
};

export default LiveMarketPriceWidget;