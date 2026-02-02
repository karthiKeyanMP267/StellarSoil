import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNotification } from '../components/Notification';
import OrderMap from '../components/OrderMap';
import { MapPinIcon, ChevronDownIcon, ChevronUpIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function FarmerDeliveries() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [verifying, setVerifying] = useState(null);
  const [codes, setCodes] = useState({});
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const notify = useNotification();

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

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
    <div className="min-h-screen pt-20 sm:pt-24 px-3 sm:px-4 md:px-6 pb-8 sm:pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Deliveries & Order Tracking</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Track customer locations and manage deliveries efficiently</p>
        
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <div className="p-8 text-center text-gray-500">
                <MapPinIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No upcoming deliveries.</p>
              </div>
            </Card>
          ) : orders.map(o => {
            const isExpanded = expandedOrders.has(o._id);
            
            return (
              <Card key={o._id} className="overflow-hidden">
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold text-lg">Order #{o._id.slice(-6)}</div>
                        {['delivered','cancelled'].includes(o.orderStatus) ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${o.orderStatus==='delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {o.orderStatus === 'delivered' ? 'Delivered' : 'Cancelled'}
                          </span>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            o.orderStatus === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                            o.orderStatus === 'ready' ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {o.orderStatus.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        Ordered on {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3">
                        <span className="font-medium">{o.items?.[0]?.product?.name}</span>
                        {o.items?.length > 1 && ` +${o.items.length - 1} more items`}
                      </div>

                      {o.deliverySlot?.date && (
                        <div className="text-sm bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-3 inline-block">
                          <span className="font-medium text-blue-800">Delivery:</span>
                          <span className="text-blue-700 ml-2">
                            {new Date(o.deliverySlot.date).toLocaleDateString()}
                            {o.deliverySlot.timeSlot && ` • ${o.deliverySlot.timeSlot}`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          o.paymentStatus==='paid' ? 'bg-green-100 text-green-700' : 
                          o.paymentStatus==='failed' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          Payment: {o.paymentStatus || 'pending'}
                        </span>
                        {o.paymentMethod && (
                          <span className="text-xs text-gray-600">({o.paymentMethod.toUpperCase()})</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!['delivered','cancelled'].includes(o.orderStatus) && (
                        <>
                          {o.orderStatus !== 'ready' && (
                            <Button size="small" variant="outline" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'ready')}>
                              Mark Ready
                            </Button>
                          )}
                          {o.orderStatus !== 'out_for_delivery' && (
                            <Button size="small" variant="outline" disabled={saving===o._id} onClick={() => updateStatus(o._id, 'out_for_delivery')}>
                              Out for Delivery
                            </Button>
                          )}
                          {o.orderStatus !== 'delivered' && (
                            <Button 
                              size="small" 
                              variant="primary" 
                              disabled={saving===o._id || (o.paymentMethod==='cod' && !o?.deliveryVerification?.verified)} 
                              onClick={() => updateStatus(o._id, 'delivered')}
                            >
                              Mark Delivered
                            </Button>
                          )}
                        </>
                      )}
                      {o.deliveryType === 'delivery' && o.deliveryAddress?.coordinates && (
                        <Button 
                          size="small" 
                          variant="primary"
                          onClick={() => navigate(`/farmer/track/${o._id}`)}
                          className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <TruckIcon className="h-4 w-4" />
                          Track Delivery
                        </Button>
                      )}
                      <Button 
                        size="small" 
                        variant="ghost" 
                        onClick={() => toggleOrderExpand(o._id)}
                        className="flex items-center gap-1"
                      >
                        <MapPinIcon className="h-4 w-4" />
                        {isExpanded ? 'Hide' : 'View'} Location
                        {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* COD verification UI */}
                  {o.paymentMethod === 'cod' && !o?.deliveryVerification?.verified && ['ready','out_for_delivery'].includes(o.orderStatus) && (
                    <div className="mt-4 pt-4 border-t flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter customer verification code"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
                        value={codes[o._id] || ''}
                        onChange={(e) => setCodes(prev => ({ ...prev, [o._id]: e.target.value }))}
                      />
                      <Button size="small" variant="outline" disabled={verifying===o._id} onClick={() => verifyCode(o._id)}>
                        {verifying===o._id ? 'Verifying…' : 'Verify Code'}
                      </Button>
                      <Button size="small" variant="ghost" onClick={() => regenerateCode(o._id)}>
                        Regenerate
                      </Button>
                    </div>
                  )}

                  {o?.deliveryVerification?.verified && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="p-3 text-sm rounded-lg bg-green-50 border border-green-200 text-green-700">
                        ✓ COD verified and order delivered successfully
                      </div>
                    </div>
                  )}

                  {/* Expanded Section with Map */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2">Delivery Location Map</h4>
                        {o.deliveryAddress && (
                          <div className="text-sm text-gray-700 mb-3">
                            <div className="font-medium text-gray-800">Address:</div>
                            {o.deliveryAddress.street && <div>{o.deliveryAddress.street}</div>}
                            {(o.deliveryAddress.city || o.deliveryAddress.state) && (
                              <div>
                                {o.deliveryAddress.city}{o.deliveryAddress.city && o.deliveryAddress.state ? ', ' : ''}{o.deliveryAddress.state}
                                {o.deliveryAddress.zipCode && ` - ${o.deliveryAddress.zipCode}`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <OrderMap order={o} viewMode="farmer" height="400px" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
