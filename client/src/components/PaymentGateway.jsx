import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentGateway = ({ amount, orderId, onSuccess }) => {
  const navigate = useNavigate();

  const initializeRazorpay = () => {
    // Razorpay test mode configuration
    const options = {
      key: "rzp_test_YOUR_KEY_HERE", // Replace with your test key
      amount: amount * 100, // Amount in smallest currency unit
      currency: "INR",
      name: "StellarSoil",
      description: "Purchase from Local Farmers",
      order_id: orderId,
      handler: function (response) {
        // Handle successful payment
        onSuccess(response);
        navigate('/orders');
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#16a34a"
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <button
      onClick={initializeRazorpay}
      className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-md hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentGateway;
