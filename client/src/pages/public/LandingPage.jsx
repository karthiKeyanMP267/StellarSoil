
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, TruckIcon, StarIcon, CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-800/20 via-amber-700/30 to-yellow-800/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-yellow-300/10 to-amber-300/10 rounded-full blur-lg"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-20 md:py-32">
          <div className="w-full flex flex-col items-center justify-between">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-gradient-to-r from-yellow-500/30 to-amber-500/30 backdrop-blur-lg rounded-full border border-yellow-300/50 shadow-2xl hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="w-16 h-16 text-yellow-600 drop-shadow-lg" />
                </div>
              </div>
              <h1 className="text-7xl md:text-8xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 mb-8 tracking-tight drop-shadow-2xl leading-tight">
                Connecting Farms to Your Table
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-bold max-w-4xl mx-auto leading-relaxed tracking-wide">
                Fresh, Local, and Sustainable Produce, Direct from the Source. 
                <span className="block mt-4 text-amber-300 font-black text-3xl md:text-4xl drop-shadow-lg">Experience the future of farming marketplace.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-12">
              <Link 
                to="/marketplace" 
                className="group relative px-12 py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xl rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:shadow-amber-500/30 tracking-wide drop-shadow-xl"
              >
                <span className="relative z-10">🛒 Shop Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/#features" 
                className="group px-12 py-6 bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white font-black text-xl rounded-full transition-all duration-300 hover:bg-white/30 hover:scale-110 shadow-2xl tracking-wide"
              >
                <span className="flex items-center gap-3">
                  ✨ Learn More
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Image with Overlay */}
        <img src="/hero-farm.jpg" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="Farm background" />
      </main>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gradient-to-b from-amber-900 to-orange-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-8 tracking-tight drop-shadow-2xl">
              Why Choose StellarSoil?
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-medium tracking-wide leading-relaxed">
              Discover the benefits of our revolutionary farm-to-table marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="group relative p-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 text-center transition-all duration-500 hover:scale-110 hover:shadow-3xl hover:shadow-amber-500/30 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="p-6 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-full w-fit mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="w-10 h-10 text-amber-200 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black mb-6 text-white tracking-wide drop-shadow-lg">Verified Farmers</h3>
                <p className="text-gray-300 leading-relaxed font-medium">Shop with confidence from farmers who are verified for quality and authenticity.</p>
              </div>
            </div>
            
            <div className="group relative p-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 text-center transition-all duration-500 hover:scale-110 hover:shadow-3xl hover:shadow-orange-500/30 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="p-6 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full w-fit mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <TruckIcon className="w-10 h-10 text-orange-200 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black mb-6 text-white tracking-wide drop-shadow-lg">Direct Delivery</h3>
                <p className="text-gray-300 leading-relaxed font-medium">Get the freshest produce delivered directly from the farm to your doorstep.</p>
              </div>
            </div>
            
            <div className="group relative p-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 text-center transition-all duration-500 hover:scale-110 hover:shadow-3xl hover:shadow-red-500/30 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-amber-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="p-6 bg-gradient-to-r from-red-500/30 to-amber-500/30 rounded-full w-fit mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <CurrencyDollarIcon className="w-10 h-10 text-red-200 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black mb-6 text-white tracking-wide drop-shadow-lg">Fair Prices</h3>
                <p className="text-gray-300 leading-relaxed font-medium">By cutting out the middleman, we ensure fair prices for both consumers and farmers.</p>
              </div>
            </div>
            
            <div className="group relative p-10 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 text-center transition-all duration-500 hover:scale-110 hover:shadow-3xl hover:shadow-pink-500/30 transform">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="p-6 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full w-fit mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <StarIcon className="w-10 h-10 text-pink-200 drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black mb-6 text-white tracking-wide drop-shadow-lg">Community Focused</h3>
                <p className="text-gray-300 leading-relaxed font-medium">Join a community that supports local agriculture and sustainable practices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple steps to connect you with fresh, local produce
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            <div className="group relative w-full lg:w-1/3 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Browse & Discover</h3>
                <p className="text-gray-300 leading-relaxed">Explore a wide variety of products from local farms in your area.</p>
              </div>
            </div>
            
            <div className="group relative w-full lg:w-1/3 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Place Your Order</h3>
                <p className="text-gray-300 leading-relaxed">Add items to your cart and checkout securely with multiple payment options.</p>
              </div>
            </div>
            
            <div className="group relative w-full lg:w-1/3 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Enjoy Freshness</h3>
                <p className="text-gray-300 leading-relaxed">Receive your order, harvested and delivered for maximum freshness and quality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-slate-900 to-black py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-2">
                StellarSoil
              </h3>
              <p className="text-gray-400">Connecting Farms to Your Table</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
              <Link to="/about" className="text-gray-300 hover:text-amber-300 transition-colors duration-300">About Us</Link>
              <Link to="/contact" className="text-gray-300 hover:text-orange-300 transition-colors duration-300">Contact</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-red-300 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-300 hover:text-pink-300 transition-colors duration-300">Terms of Service</Link>
            </div>
            
            <div className="border-t border-white/10 pt-8">
              <p className="text-gray-400">&copy; 2025 StellarSoil. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
