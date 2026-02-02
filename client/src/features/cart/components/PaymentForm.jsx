import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../api/api';
import {
  CreditCardIcon,
  BanknotesIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import DeliveryForm from './DeliveryForm';

const PaymentForm = ({ cart, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Set default to COD
  const [deliveryDetails, setDeliveryDetails] = useState({
    type: 'delivery',
    slot: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      landmark: ''
    }
  });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const validateDeliveryDetails = () => {
    const { address, slot } = deliveryDetails;
    
    // Check if required address fields are filled
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.phoneNumber) {
      if (onError) onError('Please fill in all required address fields');
      return false;
    }

    // Check if delivery slot is selected
    if (!slot.trim()) {
      if (onError) onError('Please select a delivery/pickup time slot');
      return false;
    }

    // Validate phone number format (simple validation)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(address.phoneNumber.replace(/[\s-]/g, ''))) {
      if (onError) onError('Please enter a valid phone number');
      return false;
    }

    // Validate zip code format (basic validation)
    const zipRegex = /^\d{5,6}$/;
    if (!zipRegex.test(address.zipCode.replace(/\s/g, ''))) {
      if (onError) onError('Please enter a valid zip/postal code');
      return false;
    }

    return true;
  };

  const handleCardPayment = async () => {
    if (!validateDeliveryDetails()) return;

    setLoading(true);
    try {
      // Initialize payment
      const { data } = await API.post('/payment/initialize', {
        cartIds: Array.from(new Set(cart.items.map(i => i.cartId))).filter(Boolean)
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'StellarSoil',
        description: 'Farm Fresh Products',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Format delivery slot for the server
            const [slotDate, slotTime] = deliveryDetails.slot.split('T');
            const deliverySlot = {
              date: new Date(`${slotDate}T${slotTime}`),
              timeSlot: slotTime ? 
                `${parseInt(slotTime.split(':')[0])}:00 - ${parseInt(slotTime.split(':')[0])}:59` :
                null
            };

            // Verify payment and create order
            const orderResponse = await API.post('/payment/verify', {
              cartIds: Array.from(new Set(cart.items.map(i => i.cartId))).filter(Boolean),
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              deliveryAddress: deliveryDetails.address,
              deliveryType: deliveryDetails.type,
              deliverySlot
            });

            if (onSuccess) onSuccess(orderResponse.data);
          } catch (err) {
            if (onError) onError(err.response?.data?.msg || 'Payment verification failed');
          }
        },
        prefill: {
          name: cart.user?.name || '',
          email: cart.user?.email || ''
        },
        theme: {
          color: '#f97316' // Orange color
        }
      };

      const razorpayLoaded = await loadRazorpay();
      if (razorpayLoaded) {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        throw new Error('Razorpay SDK failed to load');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Payment initialization failed';
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        if (onError) onError('Please log in to continue');
        // Redirect to login if needed
        window.location.href = '/login?redirect=/checkout';
      } else if (err.response?.status === 403) {
        if (onError) onError('Only buyers can make payments');
      } else {
        if (onError) onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = async () => {
    if (!validateDeliveryDetails()) return;
    
    // Format delivery slot for the server
    const [slotDate, slotTime] = deliveryDetails.slot.split('T');
    const deliverySlot = {
      date: new Date(`${slotDate}T${slotTime}`),
      timeSlot: slotTime ? 
        `${parseInt(slotTime.split(':')[0])}:00 - ${parseInt(slotTime.split(':')[0])}:59` :
        null
    };
    
    // To be implemented later
    onError('UPI payment is coming soon');
  };

  const handleCashOnDelivery = async () => {
    if (!validateDeliveryDetails()) return;

    setLoading(true);
    try {
      // Format delivery slot for the server
      const [slotDate, slotTime] = deliveryDetails.slot.split('T');
      const deliverySlot = {
        date: new Date(`${slotDate}T${slotTime}`),
        timeSlot: slotTime ? 
          `${parseInt(slotTime.split(':')[0])}:00 - ${parseInt(slotTime.split(':')[0])}:59` :
          null
      };
      
      // Create order with COD payment method
      const response = await API.post('/orders', {
        items: cart.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        deliveryType: deliveryDetails.type,
        deliveryAddress: deliveryDetails.address,
        deliverySlot,
        paymentMethod: 'cod',
        cartIds: Array.from(new Set(cart.items.map(i => i.cartId))).filter(Boolean)
      });

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error('Error placing COD order:', err);
      const errorMsg = err.response?.data?.msg || 'Failed to place cash on delivery order';
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ id, title, description, icon, selected, onSelect }) => (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
        selected ? 'bg-amber-50 border-amber-500 shadow-lg' : 'bg-white border-gray-200 hover:border-amber-300'
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-xl ${
          selected ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${selected ? 'text-amber-800' : 'text-gray-700'}`}>{title}</h4>
          <p className={`text-sm ${selected ? 'text-amber-700' : 'text-gray-500'}`}>{description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border ${
          selected ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
        } flex items-center justify-center`}>
          {selected && <CheckCircleIcon className="w-5 h-5 text-white" />}
        </div>
      </div>
    </motion.div>
  );

  const handlePayment = () => {
    switch (paymentMethod) {
      case 'card':
        handleCardPayment();
        break;
      case 'upi':
        handleUPIPayment();
        break;
      case 'cod':
        handleCashOnDelivery();
        break;
      default:
        if (onError) onError('Please select a payment method');
    }
  };

  return (
    <div className="space-y-8">
      {/* Delivery Details Form */}
      <DeliveryForm 
        deliveryDetails={deliveryDetails}
        onChange={setDeliveryDetails}
        farmId={cart?.farmId || null}
      />

      {/* Payment Method Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-5 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-amber-100 shadow-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-md">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-amber-800">Payment Method</h3>
        </div>

        <div className="space-y-3">
          <PaymentOption 
            id="cod"
            title="Cash on Delivery"
            description="Pay when you receive your order"
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            selected={paymentMethod === 'cod'}
            onSelect={setPaymentMethod}
          />
          
          <PaymentOption 
            id="card"
            title="Credit/Debit Card"
            description="Pay securely with your card"
            icon={<CreditCardIcon className="h-6 w-6" />}
            selected={paymentMethod === 'card'}
            onSelect={setPaymentMethod}
          />
          
          <PaymentOption 
            id="upi"
            title="UPI Payment"
            description="Pay using any UPI app"
            icon={<PhoneIcon className="h-6 w-6" />}
            selected={paymentMethod === 'upi'}
            onSelect={setPaymentMethod}
          />
          
          <PaymentOption 
            id="bank"
            title="Net Banking"
            description="Pay using your bank account"
            icon={<BanknotesIcon className="h-6 w-6" />}
            selected={paymentMethod === 'bank'}
            onSelect={setPaymentMethod}
          />
        </div>
      </motion.div>

      {/* Order Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:via-orange-700 hover:to-amber-700 transition-all duration-300 shadow-lg text-lg flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Proceed to Payment'}
            </>
          )}
        </motion.button>

        <p className="mt-4 text-center text-sm text-amber-700">
          {paymentMethod === 'cod' 
            ? 'You will receive a verification code for delivery confirmation.'
            : 'Your payment information is encrypted and secure.'}
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentForm;
