import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
  FaceSmileIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-bounce opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce delay-500 opacity-20"></div>
        <div className="absolute bottom-1/3 left-1/6 w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-bounce delay-1000 opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full animate-bounce delay-1500 opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-12 relative">
            <div className="text-[20rem] md:text-[25rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 leading-none animate-pulse-slow opacity-20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-12 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-amber-200/50 animate-bounce-gentle">
                <QuestionMarkCircleIcon className="h-32 w-32 text-amber-600 animate-wiggle" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 mb-8 tracking-tight animate-fade-in-up">
              🚫 Oops! Page Not Found
            </h1>
            <p className="text-3xl md:text-4xl text-amber-700 font-bold max-w-4xl mx-auto mb-8 leading-relaxed animate-slide-in-bottom">
              ✨ Looks like this page took a vacation to the countryside! 🌾
            </p>
            <p className="text-xl md:text-2xl text-amber-600 font-medium max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Don't worry, even the best farmers sometimes lose track of their crops. Let's get you back to familiar soil! 🚜
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/"
              className="group flex items-center px-12 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-xl tracking-wide animate-scale-in"
            >
              <HomeIcon className="h-8 w-8 mr-4 group-hover:animate-bounce" />
              🏠 Back to Home
            </Link>
            
            <Link
              to="/marketplace"
              className="group flex items-center px-12 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-xl tracking-wide animate-scale-in delay-200"
            >
              <MagnifyingGlassIcon className="h-8 w-8 mr-4 group-hover:animate-bounce" />
              🛒 Browse Marketplace
            </Link>
          </div>

          {/* Helpful Suggestions */}
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 p-12 max-w-5xl mx-auto mb-16 animate-fade-in-up delay-500">
            <h2 className="text-4xl font-black text-amber-900 mb-8 flex items-center justify-center">
              <SparklesIcon className="h-10 w-10 mr-4 text-amber-600 animate-spin-slow" />
              💡 Here's what you can do instead:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: HomeIcon,
                  title: '🏠 Go Home',
                  desc: 'Return to our beautiful homepage',
                  link: '/',
                  color: 'from-blue-500 to-cyan-600'
                },
                {
                  icon: MagnifyingGlassIcon,
                  title: '🛒 Shop Products',
                  desc: 'Browse our premium marketplace',
                  link: '/marketplace',
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  icon: HeartIcon,
                  title: '💖 About Us',
                  desc: 'Learn about our mission',
                  link: '/about',
                  color: 'from-pink-500 to-rose-600'
                },
                {
                  icon: QuestionMarkCircleIcon,
                  title: '❓ Get Help',
                  desc: 'Check our FAQ section',
                  link: '/faq',
                  color: 'from-purple-500 to-indigo-600'
                }
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150 + 600}ms` }}
                >
                  <div className={`p-4 bg-gradient-to-r ${item.color} rounded-2xl mb-4 group-hover:scale-110 transition-all duration-300 shadow-xl mx-auto w-fit`}>
                    <item.icon className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl font-black text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-amber-700 font-medium group-hover:text-amber-600 transition-colors">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Fun Facts Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200/50 p-12 max-w-4xl mx-auto mb-16 animate-slide-in-bottom delay-700">
            <h3 className="text-3xl font-black text-green-900 mb-8 flex items-center justify-center">
              <FaceSmileIcon className="h-10 w-10 mr-4 text-green-600 animate-heartbeat" />
              🌱 Fun Farm Fact!
            </h3>
            <div className="bg-white/80 rounded-2xl p-8 border border-green-200/50">
              <p className="text-2xl text-green-800 font-bold leading-relaxed">
                🚜 Did you know that a single earthworm can eat its own body weight in organic matter every day? 
                That's like a farmer eating 70kg of food daily! 
              </p>
              <div className="flex items-center justify-center mt-6 space-x-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-6 w-6 text-yellow-500 fill-current animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Error Code Details */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl border-2 border-red-200/50 p-8 max-w-3xl mx-auto animate-rotate-in delay-900">
            <div className="flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mr-4 animate-wiggle" />
              <h3 className="text-2xl font-black text-red-900">🔍 Technical Details</h3>
            </div>
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-red-200/50">
                <span className="text-red-800 font-bold">Error Code:</span>
                <span className="text-red-600 font-black text-lg">404 - Page Not Found</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-red-200/50">
                <span className="text-red-800 font-bold">Status:</span>
                <span className="text-red-600 font-black text-lg">❌ Resource Not Available</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/80 rounded-xl border border-red-200/50">
                <span className="text-red-800 font-bold">Suggestion:</span>
                <span className="text-red-600 font-black text-lg">🔄 Try a different path</span>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-16 animate-fade-in-up delay-1000">
            <p className="text-xl text-amber-600 font-medium mb-4">
              🌟 Need more help? We're always here to assist you!
            </p>
            <div className="flex items-center justify-center space-x-8">
              <Link
                to="/contact"
                className="text-amber-700 hover:text-amber-900 font-bold text-lg hover:scale-110 transition-all duration-300 flex items-center"
              >
                📞 Contact Support
              </Link>
              <span className="text-amber-400">•</span>
              <Link
                to="/faq"
                className="text-amber-700 hover:text-amber-900 font-bold text-lg hover:scale-110 transition-all duration-300 flex items-center"
              >
                ❓ View FAQ
              </Link>
              <span className="text-amber-400">•</span>
              <Link
                to="/"
                className="text-amber-700 hover:text-amber-900 font-bold text-lg hover:scale-110 transition-all duration-300 flex items-center"
              >
                🏠 Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-100/50 to-transparent pointer-events-none"></div>
      
      {/* Animated Tractor */}
      <div className="absolute bottom-8 left-0 animate-slide-in-right delay-1200 pointer-events-none">
        <div className="text-6xl animate-bounce-gentle">🚜</div>
      </div>
      
      {/* Animated Crops */}
      <div className="absolute bottom-8 right-8 animate-wiggle delay-1500 pointer-events-none">
        <div className="text-5xl">🌾</div>
      </div>
    </div>
  );
};

export default NotFound;
