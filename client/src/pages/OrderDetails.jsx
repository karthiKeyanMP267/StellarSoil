import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (e) {
      setError(e?.response?.data?.msg || 'Failed to load order');
    }
  };

  useEffect(() => {
    fetchOrder();
    const t = setInterval(fetchOrder, 5000);
    return () => clearInterval(t);
  }, [id]);

  if (error) return <div className="pt-24 px-6 text-red-600">{error}</div>;
  if (!order) return <div className="pt-24 px-6">Loading order…</div>;

  return (
    <div className="min-h-screen pt-24 px-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id.slice(-6)}</h1>
      <div className="mb-4">Status: <span className="font-semibold">{order.orderStatus.replace(/_/g,' ')}</span></div>
      {order.verificationCode?.code && !order.deliveryVerification?.verified && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">COD verification code: <span className="font-mono">{order.verificationCode.code}</span></div>
      )}
      <div className="space-y-2 mb-6">
        {(order.items||[]).map((it, idx) => (
          <div key={idx} className="p-3 bg-white border rounded">
            <div className="font-semibold">{it.product?.name}</div>
            <div className="text-sm text-gray-600">{it.quantity} {it.unit} • ₹{it.price * it.quantity}</div>
          </div>
        ))}
      </div>
      <div className="font-semibold">Total: ₹{Math.max(0,(order.totalAmount||0) - (order.discount||0))}</div>
      <div className="mt-6"><Link className="text-amber-700 underline" to="/orders">Back to My Orders</Link></div>
    </div>
  );
}
