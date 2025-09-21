import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNotification } from '../components/ui/Notification';

export default function FarmerDeliveries() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [codes, setCodes] = useState({});
  const notify = useNotification();

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
      notify.success(`Order updated to ${status.replace(/_/g,' ')}`);
    } catch (e) {
      notify.error(e?.response?.data?.msg || 'Failed to update status');
    } finally {
      setSaving(null);
    }
  };

  const verifyCode = async (orderId) => {
    const code = codes[orderId]?.trim();
    if (!code) return alert('Enter the verification code');
    try {
      setVerifying(orderId);
      await API.post('/orders/verify-delivery', { orderId, verificationCode: code });
      await fetchOrders();
      notify.success('Verification successful. Order delivered.');
    } catch (e) {
      notify.error(e?.response?.data?.msg || 'Failed to verify code');
    } finally {
      setVerifying(null);
    }
  };

  const regenerateCode = async (orderId) => {
    try {
      await API.post(`/orders/${orderId}/regenerate-code`);
      notify.success('New verification code sent to the customer');
    } catch (e) {
      notify.error(e?.response?.data?.msg || 'Failed to regenerate code');
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
                {['delivered','cancelled'].includes(o.orderStatus) ? (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.orderStatus==='delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {o.orderStatus === 'delivered' ? 'Delivered' : 'Cancelled'}
                  </span>
                ) : (
                  <div className="flex gap-2 items-start">
                    {o.orderStatus !== 'ready' && (
                      <Button size="small" variant="outline" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'ready')}>Mark Ready</Button>
                    )}
                    {o.orderStatus !== 'out_for_delivery' && (
                      <Button size="small" variant="outline" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'out_for_delivery')}>Out for Delivery</Button>
                    )}
                    {o.orderStatus !== 'delivered' && (
                      <Button size="small" variant="primary" disabled={saving===o._id || (o.paymentMethod==='cod' && !o?.deliveryVerification?.verified)} onClick={() => updateStatus(o._id, 'delivered')}>
                        Delivered
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {/* COD verification UI */}
              {o.paymentMethod === 'cod' && !o?.deliveryVerification?.verified && ['ready','out_for_delivery'].includes(o.orderStatus) && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    className="border rounded px-3 py-2 text-sm"
                    value={codes[o._id] || ''}
                    onChange={(e) => setCodes(prev => ({ ...prev, [o._id]: e.target.value }))}
                  />
                  <Button size="small" variant="outline" disabled={verifying===o._id} onClick={() => verifyCode(o._id)}>
                    {verifying===o._id ? 'Verifying…' : 'Verify Code'}
                  </Button>
                  <Button size="small" variant="ghost" onClick={() => regenerateCode(o._id)}>Regenerate Code</Button>
                </div>
              )}
              {o?.deliveryVerification?.verified && (
                <div className="mt-3 p-2 text-sm rounded bg-green-50 border border-green-200 text-green-700">
                  COD verified and order delivered
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
