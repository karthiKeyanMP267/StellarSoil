
import React from 'react';
import Navbar from '../components/Navbar';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your privacy is important to us. This policy explains what information we collect and how we use it.
        </p>
        <div className="prose max-w-none">
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, phone number, and payment information.</p>
          
          <h2>How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, process transactions, communicate with you, and for security purposes. We do not sell your personal information to third parties.</p>
          
          <h2>Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
