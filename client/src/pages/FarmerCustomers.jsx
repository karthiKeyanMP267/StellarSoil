import React, { useEffect, useMemo, useState } from 'react';
import API from '../api/api';
import { Card } from '../components/Card';

export default function FarmerCustomers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/orders/farmer-orders');
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError(e?.response?.data?.msg || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    for (const o of orders) {
      const b = o.buyer;
      if (!b?._id) continue;
      const key = b._id;
      const current = map.get(key) || { name: b.name || 'Customer', email: b.email, phone: b.phone, orders: 0, spent: 0 };
      current.orders += 1;
      current.spent += Math.max(0, (o.totalAmount||0) - (o.discount||0));
      map.set(key, current);
    }
    return [...map.entries()].map(([id, data]) => ({ id, ...data })).sort((a,b)=>b.spent-a.spent);
  }, [orders]);

  if (loading) return <div className="pt-24 px-6">Loading customers…</div>;
  if (error) return <div className="pt-24 px-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <Card>
        <div className="p-4">
          {customers.length === 0 ? (
            <div className="text-sm text-gray-500">No customers yet.</div>
          ) : (
            <div className="divide-y">
              {customers.map(c => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-beige-800">{c.name}</div>
                    <div className="text-sm text-beige-600">{c.email || '—'} • {c.phone || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{c.spent.toFixed(2)}</div>
                    <div className="text-xs text-beige-600">{c.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
