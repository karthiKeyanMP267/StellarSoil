import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, CubeIcon } from '@heroicons/react/24/outline';
import API from '../api/api';

const LiveStockPredictionWidget = () => {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [daysAhead, setDaysAhead] = useState(30);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await API.get('/products/mine');
        const list = Array.isArray(res.data) ? res.data : [];
        setProducts(list);
        if (list.length && !selectedId) {
          setSelectedId(list[0]._id);
          setCurrentStock(String(list[0].stock ?? ''));
        }
      } catch (e) {
        // Keep widget usable in manual mode even if API fails
        setProducts([]);
      }
    };
    fetchMine();
  }, []);

  const selected = products.find(p => p._id === selectedId);

  const predict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        product_name: selected?.name || 'Product',
        current_stock: Number(currentStock) || 0,
        days_ahead: Number(daysAhead) || 30
        // sales_history optional; backend falls back safely
      };
      const res = await API.post('/ml/stock-prediction', payload);
      setResult(res.data);
    } catch (e) {
      console.error('Stock prediction failed:', e);
      setError('Failed to load stock prediction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selected) {
      setCurrentStock(String(selected.stock ?? ''));
    }
  }, [selectedId]);

  const ProjectedTable = ({ projected = [] }) => {
    const rows = projected.slice(0, 7); // show a week preview
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-beige-600">
              <th className="py-1 pr-4">Date</th>
              <th className="py-1 pr-4">Predicted Sold</th>
              <th className="py-1">Projected Stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-beige-100">
                <td className="py-1 pr-4 text-beige-700">{r.date}</td>
                <td className="py-1 pr-4 text-beige-700">{r.predicted_sold?.toFixed?.(2) ?? r.predicted_sold}</td>
                <td className="py-1 text-beige-800 font-medium">{r.projected_stock?.toFixed?.(2) ?? r.projected_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const badge = (ok) => (
    ok ? (
      <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
        <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> Healthy
      </span>
    ) : (
      <span className="inline-flex items-center text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
        <ArrowTrendingDownIcon className="h-3 w-3 mr-1" /> Risk of stockout
      </span>
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-beige-200 shadow-lg overflow-hidden"
    >
      <div className="p-4 bg-gradient-to-r from-beige-50 to-cream-50 border-b border-beige-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CubeIcon className="h-5 w-5 text-beige-700 mr-2" />
            <h3 className="font-semibold text-beige-800">Live Stock Prediction</h3>
          </div>
          {badge(!result?.stockout_date)}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-beige-600 mb-1">Product</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Manual entry</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-beige-600 mb-1">Current Stock</label>
            <input
              type="number"
              value={currentStock}
              onChange={(e) => setCurrentStock(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 120"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-beige-600 mb-1">Days Ahead</label>
            <input
              type="number"
              value={daysAhead}
              onChange={(e) => setDaysAhead(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-beige-300 rounded-lg focus:ring-2 focus:ring-green-500"
              min="1"
              max="365"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={predict}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Predicting…' : 'Predict'}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>

        {result?.success && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-beige-600">Average Daily Sales Forecast</div>
                <div className="text-lg font-semibold text-beige-800">{result.average_daily_sales_forecast?.toFixed?.(2) ?? result.average_daily_sales_forecast}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-beige-600">Projected Stockout</div>
                <div className={`text-lg font-semibold ${result.stockout_date ? 'text-red-700' : 'text-green-700'}`}>
                  {result.stockout_date || 'No stockout in horizon'}
                </div>
              </div>
            </div>
            <ProjectedTable projected={result.projected} />
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-beige-50 border-t border-beige-100 text-xs text-beige-500">
        Live stock forecast is indicative and based on historical patterns.
      </div>
    </motion.div>
  );
};

export default LiveStockPredictionWidget;
