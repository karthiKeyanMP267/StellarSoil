
import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About StellarSoil</h1>
        <p className="text-lg text-gray-600 mb-6">
          StellarSoil is dedicated to revolutionizing the agricultural supply chain by directly connecting farmers with consumers and businesses. Our platform empowers local farmers by providing them with the tools to reach a wider market, manage their farms efficiently, and get fair prices for their produce.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          For consumers, we offer access to the freshest, locally-sourced products, ensuring quality and supporting sustainable farming practices. We believe in a future where technology and agriculture work hand-in-hand to create a more transparent, efficient, and equitable food system for everyone.
        </p>
        <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-600">
          Our mission is to build a robust digital ecosystem that bridges the gap between urban and rural communities, fostering economic growth for farmers and delivering unparalleled freshness to consumers.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
