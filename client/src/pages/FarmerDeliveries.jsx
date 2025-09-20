import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function FarmerDeliveries() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/farmer-orders');
      const list = Array.isArray(res.data) ? res.data : [];
      setOrders(list.filter(o => o.deliverySlot?.date || ['processing','ready','out_for_delivery','placed','confirmed'].includes(o.orderStatus)));
    } catch (e) {
      setError(e?.response?.data?.msg || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setSaving(orderId);
      await API.put(`/orders/${orderId}/status`, { status });
      await fetchOrders();
    } catch (e) {
      alert(e?.response?.data?.msg || 'Failed to update status');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="pt-24 px-6">Loading deliveries…</div>;
  if (error) return <div className="pt-24 px-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen pt-24 px-6">
      <h1 className="text-3xl font-bold mb-6">Deliveries</h1>
      <Card>
        <div className="p-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-sm text-gray-500">No upcoming deliveries.</div>
          ) : orders.map(o => (
            <div key={o._id} className="p-3 bg-white rounded-lg border border-beige-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">Order #{o._id.slice(-6)}</div>
                  <div className="text-xs text-beige-500">Ordered on {new Date(o.createdAt).toLocaleDateString()}</div>
                  <div className="text-sm text-beige-600 mt-1">{o.items?.[0]?.product?.name} • Qty {o.items?.[0]?.quantity} {o.items?.[0]?.unit}</div>
                  {o.deliverySlot?.date && (
                    <div className="text-xs text-beige-500">Slot: {new Date(o.deliverySlot.date).toLocaleString()} {o.deliverySlot.timeSlot ? `(${o.deliverySlot.timeSlot})` : ''}</div>
                  )}
                  {o.deliveryAddress && (
                    <div className="mt-3 text-sm">
                      <div className="font-medium text-beige-700">Delivery Address:</div>
                      <div className="text-beige-700">
                        {o.deliveryAddress.street && <div>{o.deliveryAddress.street}</div>}
                        {(o.deliveryAddress.city || o.deliveryAddress.state) && (
                          <div>
                            {o.deliveryAddress.city}{o.deliveryAddress.city && o.deliveryAddress.state ? ', ' : ''}{o.deliveryAddress.state}
                          </div>
                        )}
                        {o.deliveryAddress.zipCode && <div>{o.deliveryAddress.zipCode}</div>}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 text-sm">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${o.paymentStatus==='paid' ? 'bg-green-100 text-green-700' : o.paymentStatus==='failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      Payment: {o.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {o.orderStatus !== 'ready' && (
                    <Button size="small" variant="outline" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'ready')}>Mark Ready</Button>
                  )}
                  {o.orderStatus !== 'out_for_delivery' && (
                    <Button size="small" variant="outline" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'out_for_delivery')}>Out for Delivery</Button>
                  )}
                  {o.orderStatus !== 'delivered' && (
                    <Button size="small" variant="primary" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'delivered')}>Delivered</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
