import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/api';
import { Card } from '../components/Card';

export default function FarmerAnalytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Prefer dedicated analytics endpoint if available
        try {
          const a = await API.get('/analytics/farmer-summary');
          if (a.data?.orders) {
            setOrders(a.data.orders);
            setLoading(false);
            return;
          }
        } catch {}
        // Fallback to farmer orders
        const res = await API.get('/orders/farmer-orders');
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError(e?.response?.data?.msg || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Math.max(0, (o.totalAmount||0) - (o.discount||0)), 0);
  const completed = orders.filter(o => o.orderStatus === 'delivered').length;
  const pending = orders.filter(o => ['placed','confirmed','processing','ready','out_for_delivery'].includes(o.orderStatus)).length;
  const topProducts = (() => {
    const map = new Map();
    for (const o of orders) {
      for (const it of o.items || []) {
        const name = it.product?.name || 'Unknown';
        map.set(name, (map.get(name)||0) + it.quantity);
      }
    }
    return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
  })();

  if (loading) return <div className="pt-24 px-6">Loading analytics…</div>;
  if (error) return <div className="pt-24 px-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><div className="p-4"><div className="text-sm text-gray-500">Total Revenue</div><div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div></div></Card>
        <Card><div className="p-4"><div className="text-sm text-gray-500">Completed Orders</div><div className="text-2xl font-bold">{completed}</div></div></Card>
        <Card><div className="p-4"><div className="text-sm text-gray-500">Pending Orders</div><div className="text-2xl font-bold">{pending}</div></div></Card>
      </div>
      <Card>
        <div className="p-4">
          <h2 className="font-semibold mb-2">Top Products</h2>
          {topProducts.length === 0 ? (
            <div className="text-sm text-gray-500">No data.</div>
          ) : (
            <ul className="space-y-1">
              {topProducts.map(([name, qty]) => (
                <li key={name} className="flex justify-between"><span>{name}</span><span className="font-medium">{qty}</span></li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
