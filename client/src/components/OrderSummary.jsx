import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/api';
import { 
  ShoppingBagIcon,
  PrinterIcon,
  ArrowDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const OrderSummary = ({ order, onClose }) => {
  const [loading, setLoading] = useState(false);

  // Normalize shape: if multi, flatten for display
  const isMulti = order?.multi && Array.isArray(order.orders);
  const displayOrders = isMulti ? order.orders : [order];
  const allItems = displayOrders.flatMap(o => o.items.map(i => ({ ...i })));

  const calculateSubtotal = () => {
    return displayOrders.reduce((sum, o) => sum + (o.items || []).reduce((t, item) => t + (item.price * item.quantity), 0), 0);
  };

  const subtotal = calculateSubtotal();
  const discount = subtotal * 0.1; // 10% discount
  const total = subtotal - discount;

  const printReceipt = () => {
    window.print();
  };

  const downloadInvoice = async () => {
    setLoading(true);
    try {
      // You would implement invoice generation/download here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      // Create a simple text representation for now
      const invoiceText = `
        INVOICE #${(displayOrders[0]?._id || '').toString().substring(0, 8)}${isMulti ? ' (+more)' : ''}
        StellarSoil - Farm Fresh Products
        Date: ${new Date().toLocaleDateString()}
        
        CUSTOMER INFORMATION
        Name: ${order.user?.name || 'Customer'}
        Email: ${order.user?.email || 'N/A'}
        
        ITEMS
        ${allItems.map(item => `${item.name || item?.product?.name || 'Item'} (${item.quantity} ${item.unit}) - ₹${item.price * item.quantity}`).join('\n        ')}
        
        SUBTOTAL: ₹${subtotal.toFixed(2)}
        DISCOUNT: ₹${discount.toFixed(2)}
        TOTAL: ₹${total.toFixed(2)}
        
        PAYMENT METHOD: ${displayOrders.every(o => o.paymentMethod !== 'cod') ? 'Online Payment' : 'Cash on Delivery'}
        STATUS: ${displayOrders.map(o => o.status || o.orderStatus).join(', ')}
        
        Thank you for shopping with StellarSoil!
      `;
      
      // Create a Blob from the text
      const blob = new Blob([invoiceText], { type: 'text/plain' });
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `StellarSoil-Invoice-${order._id.substring(0, 8)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
      console.error("Error generating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:p-0 print:max-w-full print:max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="print:hidden flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Order Confirmation</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={printReceipt}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Print receipt"
            >
              <PrinterIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={downloadInvoice}
              className="p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors"
              title="Download invoice"
              disabled={loading}
            >
              <ArrowDownIcon className="h-5 w-5 text-amber-700" />
            </button>
          </div>
        </div>

        {/* Receipt Header - Visible in both screen and print */}
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-2xl font-bold text-amber-800 print:text-black">StellarSoil</h1>
          <p className="text-gray-600">Order Receipt</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          <div className="mt-2 bg-green-100 print:bg-gray-100 text-green-800 print:text-black text-sm py-1 px-3 rounded-full inline-flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Order Successful
          </div>
        </div>

        {/* Order Details */}
        <div className="border-t border-gray-200 pt-6 mb-6 print:border-t-black">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID{isMulti ? 's' : ''}</p>
              <p className="font-medium">{isMulti ? displayOrders.map(o => o._id.substring(0,8)).join(', ') : (order._id?.substring(0, 8) || 'N/A')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{displayOrders.every(o => o.paymentMethod !== 'cod') ? 'Online Payment' : 'Cash on Delivery'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{isMulti ? 'Multiple' : (order.status || order.orderStatus)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Type</p>
              <p className="font-medium capitalize">{displayOrders[0]?.deliveryType}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-200 pt-6 mb-6 print:border-t-black">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
          <div className="space-y-4">
            {allItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name || item?.product?.name || 'Item'} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBagIcon className="h-6 w-6 text-beige-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name || item?.product?.name || 'Item'}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit} × ₹{item.price}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t border-gray-200 pt-6 mb-6 print:border-t-black">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Discount (10%)</p>
              <p className="font-medium text-green-600">-₹{discount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Delivery</p>
              <p className="font-medium">Free</p>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
              <p className="font-semibold text-gray-800">Total</p>
              <p className="font-bold text-lg text-amber-700 print:text-black">₹{total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {order.deliveryAddress && (
          <div className="border-t border-gray-200 pt-6 mb-6 print:border-t-black">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h3>
            <div className="p-4 bg-gray-50 rounded-xl print:bg-white print:border print:border-gray-300">
              <p className="font-medium">{order.user?.name}</p>
              <p className="text-gray-600">{order.deliveryAddress.street}</p>
              <p className="text-gray-600">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </p>
              <p className="text-gray-600 mt-1">Phone: {order.deliveryAddress.phoneNumber}</p>
              
              {order.deliverySlot && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Delivery Slot</p>
                  <p className="font-medium">
                    {new Date(order.deliverySlot.date).toLocaleDateString()}, {order.deliverySlot.timeSlot}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Code for COD */}
        {displayOrders.some(o => o.paymentMethod === 'cod' && o.verificationCode) && (
          <div className="border-t border-gray-200 pt-6 mb-6 print:border-t-black">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Code</h3>
              <div className="space-y-3">
                {displayOrders.filter(o => o.paymentMethod === 'cod' && o.verificationCode).map((o) => (
                  <div key={o._id} className="bg-amber-50 print:bg-white print:border print:border-amber-300 border border-amber-200 p-4 rounded-xl">
                    <p className="text-amber-700 mb-2">Order #{o._id.substring(0,8)} code:</p>
                    <div className="bg-white p-4 rounded-lg border-2 border-amber-300 flex items-center justify-center">
                      <span className="text-3xl font-mono font-bold tracking-widest text-amber-900">
                        {o.verificationCode?.code || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        )}

        {/* Footer Message */}
        <div className="text-center border-t border-gray-200 pt-6 print:border-t-black">
          <p className="text-gray-600 mb-1">Thank you for shopping with StellarSoil!</p>
          <p className="text-sm text-gray-500">For any questions, contact our support team.</p>
          
          <div className="print:hidden mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSummary;