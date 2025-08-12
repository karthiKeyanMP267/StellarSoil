import React, { useState, useEffect } from 'react';
import { CurrencyRupeeIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const MarketPriceGuide = ({ onPriceValidation }) => {
  const [marketPrices, setMarketPrices] = useState({});
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [farmerPrice, setFarmerPrice] = useState('');
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const fetchMarketPrices = async () => {
    try {
      const response = await fetch('/api/market/market-prices');
      if (!response.ok) throw new Error('Failed to fetch market prices');
      
      const data = await response.json();
      if (data.success) {
        setMarketPrices(data.prices);
      }
    } catch (error) {
      console.error('Error fetching market prices:', error);
      toast.error('Failed to load market prices');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceValidation = async () => {
    if (!selectedCommodity || !farmerPrice) {
      toast.error('Please select a commodity and enter price');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/market/validate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          commodity: selectedCommodity,
          price: parseFloat(farmerPrice)
        })
      });

      if (!response.ok) throw new Error('Failed to validate price');
      
      const data = await response.json();
      if (data.success) {
        setValidation(data.validation);
        onPriceValidation && onPriceValidation(data.validation);
      }
    } catch (error) {
      console.error('Error validating price:', error);
      toast.error('Failed to validate price');
    }
  };

  const getValidationMessage = (validation) => {
    switch (validation.suggestion) {
      case 'too_low':
        return `Price is below market range. Consider pricing between ₹${validation.minAllowed}-₹${validation.maxAllowed}`;
      case 'too_high':
        return `Price is above market range. Consider pricing between ₹${validation.minAllowed}-₹${validation.maxAllowed}`;
      case 'optimal':
        return `Price is within acceptable market range. Good pricing!`;
      default:
        return 'Price validation unavailable';
    }
  };

  const getValidationIcon = (validation) => {
    switch (validation.suggestion) {
      case 'too_low':
      case 'too_high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'optimal':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const commodities = Object.keys(marketPrices);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Market Price Guide</h2>
        <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
      </div>

      {/* Current Market Prices Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Market Prices</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
          {commodities.map(commodity => {
            const price = marketPrices[commodity];
            const displayName = commodity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <div key={commodity} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <h4 className="font-medium text-gray-800 text-sm mb-1">{displayName}</h4>
                <div className="text-green-600 font-semibold">₹{price.current}/kg</div>
                <div className="text-xs text-gray-500">
                  Range: ₹{price.min} - ₹{price.max}
                </div>
                {price.market && (
                  <div className="text-xs text-gray-400 mt-1">{price.market}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Validation Tool */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Validation Tool</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Commodity
            </label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose commodity...</option>
              {commodities.map(commodity => (
                <option key={commodity} value={commodity}>
                  {commodity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Price (₹/kg)
            </label>
            <input
              type="number"
              value={farmerPrice}
              onChange={(e) => setFarmerPrice(e.target.value)}
              placeholder="Enter your price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePriceValidation}
              disabled={!selectedCommodity || !farmerPrice}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                       disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Validate Price
            </button>
          </div>
        </div>

        {/* Validation Result */}
        {validation && (
          <div className={`mt-4 p-4 rounded-lg border ${
            validation.suggestion === 'optimal' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start">
              {getValidationIcon(validation)}
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">Price Validation Result</h4>
                <p className="text-sm text-gray-700 mt-1">
                  {getValidationMessage(validation)}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Market Price: </span>
                    <span className="text-green-600">₹{validation.marketPrice}/kg</span>
                  </div>
                  <div>
                    <span className="font-medium">Suggested Range: </span>
                    <span className="text-blue-600">₹{validation.minAllowed} - ₹{validation.maxAllowed}/kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Insights */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Pricing Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep prices within 30% of market rates for better sales</li>
            <li>• Consider quality premiums for organic/premium products</li>
            <li>• Monitor prices regularly as they change with supply and demand</li>
            <li>• Factor in transportation and handling costs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketPriceGuide;
