import React from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  SparklesIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
  StarIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "/team/rajesh.jpg",
      description: "Agricultural engineer with 15+ years experience connecting farmers with markets.",
      expertise: "🌾 Farm Management"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      image: "/team/priya.jpg", 
      description: "Tech innovator passionate about sustainable agriculture and digital solutions.",
      expertise: "💻 Technology"
    },
    {
      name: "Arjun Patel",
      role: "Head of Operations",
      image: "/team/arjun.jpg",
      description: "Supply chain expert ensuring fresh produce reaches customers efficiently.",
      expertise: "🚚 Logistics"
    },
    {
      name: "Dr. Meera Singh",
      role: "Quality Assurance",
      image: "/team/meera.jpg",
      description: "Food safety specialist ensuring the highest quality standards for all products.",
      expertise: "🔬 Quality Control"
    }
  ];

  const milestones = [
    { year: "2020", title: "Company Founded", description: "Started with 10 local farms", icon: "🌱" },
    { year: "2021", title: "100+ Farmers", description: "Expanded to rural communities", icon: "👨‍🌾" },
    { year: "2022", title: "Organic Certification", description: "All partners became certified organic", icon: "✅" },
    { year: "2023", title: "Tech Innovation", description: "Launched AI-powered recommendations", icon: "🤖" },
    { year: "2024", title: "Sustainability Award", description: "Recognized for eco-friendly practices", icon: "🏆" },
    { year: "2025", title: "National Expansion", description: "Serving 500+ cities across India", icon: "🇮🇳" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-25 to-orange-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <div className="p-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-2xl animate-bounce-gentle">
                <HeartIcon className="h-20 w-20 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 mb-8 tracking-tight drop-shadow-2xl animate-pulse">
              🌾 About StellarSoil
            </h1>
            <p className="text-3xl text-amber-700 max-w-5xl mx-auto font-bold tracking-wide leading-relaxed mb-12">
              ✨ Revolutionizing agriculture through technology, sustainability, and community connection
            </p>
            
            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl font-black text-amber-900 mb-6 tracking-wide">🎯 Our Mission</h2>
              <p className="text-xl text-amber-800 leading-relaxed font-medium">
                To bridge the gap between farmers and consumers by creating a transparent, sustainable, and 
                technology-driven marketplace that ensures fresh, organic produce reaches every home while 
                empowering farmers with fair prices and direct market access.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-amber-800 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 to-orange-900/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-6 tracking-wide drop-shadow-2xl">
                📊 Our Impact in Numbers
              </h2>
              <p className="text-2xl text-amber-200 font-bold">Making a difference in the agricultural ecosystem</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-lg rounded-3xl border border-amber-400/30 mb-6 hover:scale-110 transition-all duration-500">
                  <UserGroupIcon className="h-16 w-16 text-amber-300 mx-auto group-hover:animate-pulse" />
                </div>
                <div className="text-5xl font-black text-white mb-3 tracking-tight">500+</div>
                <div className="text-xl text-amber-200 font-bold">Partner Farms</div>
              </div>
              
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-lg rounded-3xl border border-orange-400/30 mb-6 hover:scale-110 transition-all duration-500">
                  <GlobeAltIcon className="h-16 w-16 text-orange-300 mx-auto group-hover:animate-pulse" />
                </div>
                <div className="text-5xl font-black text-white mb-3 tracking-tight">100K+</div>
                <div className="text-xl text-amber-200 font-bold">Happy Customers</div>
              </div>
              
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl border border-purple-400/30 mb-6 hover:scale-110 transition-all duration-500">
                  <BuildingStorefrontIcon className="h-16 w-16 text-purple-300 mx-auto group-hover:animate-pulse" />
                </div>
                <div className="text-5xl font-black text-white mb-3 tracking-tight">1M+</div>
                <div className="text-xl text-amber-200 font-bold">Orders Delivered</div>
              </div>
              
              <div className="text-center group">
                <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-3xl border border-orange-400/30 mb-6 hover:scale-110 transition-all duration-500">
                  <StarIcon className="h-16 w-16 text-orange-300 mx-auto group-hover:animate-pulse" />
                </div>
                <div className="text-5xl font-black text-white mb-3 tracking-tight">4.9/5</div>
                <div className="text-xl text-amber-200 font-bold">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 mb-6 tracking-tight drop-shadow-2xl">
                💎 Our Core Values
              </h2>
              <p className="text-2xl text-amber-700 font-bold tracking-wide">The principles that guide everything we do</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <ShieldCheckIcon className="h-12 w-12 text-white mx-auto drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black text-amber-900 mb-4 tracking-wide">🌱 Sustainability</h3>
                <p className="text-amber-800 leading-relaxed font-medium">
                  We prioritize environmentally friendly farming practices and support regenerative agriculture 
                  to protect our planet for future generations.
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="p-6 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-3xl mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <TruckIcon className="h-12 w-12 text-white mx-auto drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black text-amber-900 mb-4 tracking-wide">🚀 Innovation</h3>
                <p className="text-amber-800 leading-relaxed font-medium">
                  We leverage cutting-edge technology to create efficient supply chains and enhance 
                  the farming experience through digital solutions.
                </p>
              </div>
              
              <div className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                  <CurrencyDollarIcon className="h-12 w-12 text-white mx-auto drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-black text-amber-900 mb-4 tracking-wide">⚖️ Fair Trade</h3>
                <p className="text-amber-800 leading-relaxed font-medium">
                  We ensure farmers receive fair compensation for their hard work while providing 
                  customers with transparent, competitive pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-amber-100/50 to-orange-100/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 mb-6 tracking-tight drop-shadow-2xl">
                👥 Meet Our Team
              </h2>
              <p className="text-2xl text-amber-700 font-bold tracking-wide">The passionate people behind StellarSoil</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {teamMembers.map((member, index) => (
                <div key={index} className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-black text-white shadow-2xl group-hover:scale-110 transition-all duration-500">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-black text-amber-900 mb-2 tracking-wide">{member.name}</h3>
                  <div className="inline-block bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-800 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-amber-400/30">
                    {member.role}
                  </div>
                  <p className="text-amber-800 leading-relaxed mb-4 font-medium">{member.description}</p>
                  <div className="text-lg font-bold text-orange-600">{member.expertise}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 mb-6 tracking-tight drop-shadow-2xl">
                🗓️ Our Journey
              </h2>
              <p className="text-2xl text-amber-700 font-bold tracking-wide">Milestones that shaped our story</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="text-center">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-all duration-500">{milestone.icon}</div>
                    <div className="text-3xl font-black text-amber-600 mb-3">{milestone.year}</div>
                    <h3 className="text-xl font-black text-amber-900 mb-4 tracking-wide">{milestone.title}</h3>
                    <p className="text-amber-800 leading-relaxed font-medium">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-amber-800 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 to-orange-900/20"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="flex justify-center mb-8">
              <SparklesIcon className="h-20 w-20 text-amber-200 animate-pulse" />
            </div>
            <h2 className="text-5xl font-black text-white mb-8 tracking-wide drop-shadow-2xl">
              🤝 Join Our Mission
            </h2>
            <p className="text-2xl text-amber-200 mb-12 font-bold leading-relaxed">
              Be part of the agricultural revolution. Together, we can create a sustainable future for farming and food.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-6 bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 text-white font-black rounded-2xl shadow-2xl hover:from-amber-600 hover:via-orange-700 hover:to-yellow-600 transition-all duration-300 hover:scale-110 text-xl tracking-wide group">
                <span className="flex items-center justify-center">
                  🌱 Start Shopping
                  <SparklesIcon className="h-6 w-6 ml-3 group-hover:animate-spin" />
                </span>
              </button>
              <button className="px-12 py-6 bg-white/90 backdrop-blur-lg border-2 border-amber-300/50 text-amber-800 font-black rounded-2xl hover:bg-white/95 hover:border-amber-400 transition-all duration-300 shadow-xl tracking-wide hover:scale-110 text-xl">
                👨‍🌾 Partner With Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
