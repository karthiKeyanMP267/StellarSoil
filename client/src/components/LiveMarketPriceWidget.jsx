import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import API from '../api/api';

// Convert commodity names to a friendly label
const label = (v = '') => String(v).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const LiveMarketPriceWidget = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [daysAhead, setDaysAhead] = useState(30);
  const [region, setRegion] = useState(null);
  const [commodities, setCommodities] = useState(['Wheat', 'Tomato', 'Onion', 'Potato', 'Rice']);

  // Helper to clamp predicted prices within ±20% band relative to current
  const clampPredictions = (current, preds) => {
    if (!current || !preds) return preds;
    const min = Math.round(current * 0.8);
    const max = Math.round(current * 1.2);
    return {
      '7d': Math.max(min, Math.min(max, preds['7d'])),
      '15d': Math.max(min, Math.min(max, preds['15d'])),
      '30d': Math.max(min, Math.min(max, preds['30d']))
    };
  };

  const fetchPriceData = async () => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      // 1) Try real-time market API first (public)
      try {
        let queryParts = [];
        if (region) {
          const { state, district, market, variety } = region;
          if (state) queryParts.push(`state=${encodeURIComponent(state)}`);
          if (district) queryParts.push(`district=${encodeURIComponent(district)}`);
          if (market) queryParts.push(`market=${encodeURIComponent(market)}`);
          if (variety) queryParts.push(`variety=${encodeURIComponent(variety)}`);
        } else {
          // Fallback to localStorage hints (legacy)
          try {
            const userRaw = localStorage.getItem('userInfo');
            if (userRaw) {
              const u = JSON.parse(userRaw);
              const state = u?.farm?.address?.state || u?.addressState;
              const district = u?.farm?.address?.district || u?.addressDistrict;
              const market = u?.farm?.name || undefined;
              if (state) queryParts.push(`state=${encodeURIComponent(state)}`);
              if (district) queryParts.push(`district=${encodeURIComponent(district)}`);
              if (market) queryParts.push(`market=${encodeURIComponent(market)}`);
            }
          } catch {}
        }
        const q = queryParts.length ? '&' + queryParts.join('&') : '';
        const live = await API.get(`/market/live-price?commodity=${encodeURIComponent(selectedCrop)}&days=${encodeURIComponent(daysAhead)}${q}`);
        if (live?.data?.success) {
          const d = live.data;
          d.predictions = clampPredictions(d.current_price, d.predictions);
          setPriceData(d);
          return;
        }
        // If non-standard success shape, continue to ML API fallback
        if (live?.data && live.status === 200) {
          const d = live.data;
          if (d?.current_price && d?.predictions) {
            d.predictions = clampPredictions(d.current_price, d.predictions);
          }
          setPriceData(d);
          setWarning('Using live market API (non-standard response).');
          return;
        }
      } catch (liveErr) {
        // proceed to ML API fallback
      }

      // 2) Try ML POST (auth)
      const response = await API.post('/ml/price-prediction', { crop: selectedCrop, days_ahead: daysAhead });
      const data = response.data;
      if (data?.success === false) {
        throw new Error(data?.error || 'Prediction failed');
      }
      if (data?.current_price && data?.predictions) {
        data.predictions = clampPredictions(data.current_price, data.predictions);
      }
      setPriceData(data);
    } catch (err) {
      console.error('Error fetching price predictions (POST):', err);
      // Try public GET endpoint as a fallback (no auth required)
      try {
        const url = `/ml/price-prediction?crop=${encodeURIComponent(selectedCrop)}&days_ahead=${encodeURIComponent(daysAhead)}`;
        const response = await API.get(url);
        const data = response.data;
        if (data?.success === false) {
          throw new Error(data?.error || 'Prediction failed');
        }
        if (data?.current_price && data?.predictions) {
          data.predictions = clampPredictions(data.current_price, data.predictions);
        }
        setPriceData(data);
        setWarning('Using ML GET fallback endpoint.');
      } catch (e2) {
        console.error('Error fetching price predictions (GET):', e2);
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
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();
  }, [selectedCrop, region]);

  // On mount, try to fetch server-provided region once if authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // skip for guests
    (async () => {
      try {
        const me = await API.get('/auth/me');
        const r = me?.data?.region || me?.data?.user?.defaultRegion;
        if (r && (r.state || r.district || r.market)) setRegion(r);
      } catch (e) {
        // non-fatal; remain without region
      }
    })();
  }, []);

  // On mount, fetch list of commodities for the dropdown
  useEffect(() => {
    (async () => {
      try {
        const resp = await API.get('/market/commodities');
        const list = resp?.data?.commodities;
        if (Array.isArray(list) && list.length) {
          setCommodities(list);
          // If currently selected crop isn't in list, pick a sensible default
          if (!list.includes(selectedCrop)) {
            const preferred = ['Wheat', 'Tomato', 'Onion', 'Potato', 'Rice'];
            const firstPreferred = preferred.find(p => list.includes(p));
            setSelectedCrop(firstPreferred || list[0]);
          }
        }
      } catch (e) {
        // keep defaults; non-fatal
      }
    })();
  }, []);

  // Listen for region defaults updates from Settings to refresh without reload
  useEffect(() => {
    const handler = async () => {
      try {
        const me = await API.get('/auth/me');
        const r = me?.data?.region || me?.data?.user?.defaultRegion;
        if (r && (r.state || r.district || r.market)) setRegion(r);
      } catch {}
    };
    window.addEventListener('region-defaults-updated', handler);
    return () => window.removeEventListener('region-defaults-updated', handler);
  }, []);

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
            className="px-3 py-1.5 text-sm border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500 max-w-[200px] truncate"
          >
            {commodities.map((name) => (
              <option key={name} value={name}>
                {label(name)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="p-4">
        {region && (region.state || region.district || region.market) && (
          <div className="mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
            {(() => {
              const parts = [region.market, region.district, region.state]
                .filter(Boolean)
                .map(p => String(p).trim());
              const uniq = parts.filter((p, i) =>
                parts.findIndex(q => q.toLowerCase() === p.toLowerCase()) === i
              );
              return `Using region: ${uniq.join(', ')}`;
            })()}
          </div>
        )}
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