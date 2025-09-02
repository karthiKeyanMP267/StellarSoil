import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import {
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
  SparklesIcon,
  ChevronRightIcon,
  StarIcon,
  BeakerIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user } = useAuth();

  // Enhanced features with color gradients and emojis
  const features = [
    {
      name: '🌱 Fresh Produce',
      description: 'Get the freshest fruits and vegetables directly from local farms, harvested at peak ripeness.',
      icon: SparklesIcon,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      name: '🚚 Fast Delivery',
      description: 'Same-day delivery for orders placed before 2 PM. Experience farm-to-table freshness.',
      icon: TruckIcon,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600'
    },
    {
      name: '🤝 Support Farmers',
      description: 'Connect directly with local farmers and support sustainable agriculture in your community.',
      icon: UserGroupIcon,
      color: 'bg-gradient-to-r from-amber-500 to-orange-600'
    },
    {
      name: '✅ Quality Assured',
      description: 'Every product is carefully inspected and comes with our freshness guarantee.',
      icon: ShieldCheckIcon,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600'
    },
  ];

  // Stats array for display
  const stats = [
    { value: '500+', label: '🌾 Fresh Products' },
    { value: '100+', label: '👨‍🌾 Local Farmers' },
    { value: '24h', label: '🚚 Fast Delivery' },
    { value: '10k+', label: '😊 Happy Customers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-beige-50">
      {/* Enhanced Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-beige-200 to-sage-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </motion.div>

        <motion.div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        >
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-sage-200 to-earth-300 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-beige-400/20 to-sage-400/20 rounded-full blur-xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-sage-400/20 to-earth-400/20 rounded-full blur-xl"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="mx-auto w-full px-6 pb-24 pt-10 sm:pb-32 lg:px-8 lg:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-x-12 max-w-7xl mx-auto">
            {/* Enhanced Left Content */}
            <motion.div 
              className="text-center lg:text-left w-full lg:w-1/2 xl:w-3/5"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mt-12 sm:mt-24 lg:mt-16">
                <motion.div 
                  className="inline-flex space-x-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.span 
                    className="rounded-full bg-gradient-to-r from-beige-500/20 to-sage-500/20 px-4 py-2 text-sm font-semibold leading-6 text-beige-700 ring-1 ring-inset ring-beige-500/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    🌟 What's new
                  </motion.span>
                  <motion.span 
                    className="inline-flex items-center space-x-2 text-sm font-medium text-beige-600"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Fresh Harvest Daily</span>
                    <ChevronRightIcon className="h-5 w-5 text-beige-500" />
                  </motion.span>
                </motion.div>
              </div>
              
              <motion.h1 
                className="mt-10 text-5xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-sage-600 to-earth-700"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.span
                  animate={{ 
                    backgroundImage: [
                      "linear-gradient(45deg, #b08d46, #4a734a, #6f4e3d)",
                      "linear-gradient(45deg, #4a734a, #6f4e3d, #b08d46)",
                      "linear-gradient(45deg, #6f4e3d, #b08d46, #4a734a)",
                      "linear-gradient(45deg, #b08d46, #4a734a, #6f4e3d)"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text'
                  }}
                >
                  Discover Fresh <br />
                  Local Produce
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="mt-6 text-lg lg:text-xl leading-8 text-earth-600 font-medium"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Connect directly with local farmers, discover fresh produce, and support sustainable farming practices. Experience the farm-to-table difference with StellarSoil.
              </motion.p>
              
              <motion.div 
                className="mt-10 flex items-center lg:justify-start justify-center gap-x-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                {!user ? (
                  <>
                    <motion.button
                      onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                      className="rounded-2xl bg-gradient-to-r from-beige-500 to-sage-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-beige-500/25 hover:from-beige-600 hover:to-sage-600 hover:shadow-beige-500/35 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🚀 Get started
                      <span className="ml-2 inline-block">→</span>
                    </motion.button>
                    <motion.button
                      onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                      className="text-base font-semibold leading-6 text-earth-700 hover:text-beige-600 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      Sign in <span aria-hidden="true">→</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/marketplace"
                      className="rounded-2xl bg-gradient-to-r from-beige-500 to-sage-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-beige-500/25 hover:from-beige-600 hover:to-sage-600 hover:shadow-beige-500/35 transition-all duration-300 inline-block"
                    >
                      🛒 Shop Now
                      <span className="ml-2 inline-block">→</span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Enhanced Right Content - Hero Image */}
            <motion.div 
              className="w-full lg:w-1/2 xl:w-2/5 mt-16 lg:mt-0"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-beige-400/30 to-sage-400/30 rounded-3xl blur-2xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <img
                  className="aspect-[3/2] w-full rounded-3xl bg-gray-50 object-cover shadow-2xl relative z-10"
                  src="/hero-farm.jpg"
                  alt="Fresh farm produce"
                />
                
                {/* Floating Stats */}
                <motion.div 
                  className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-beige-200/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <div className="text-2xl font-black text-beige-600">500+</div>
                  <div className="text-sm text-earth-600">🌾 Fresh Products</div>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-beige-200/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <div className="text-2xl font-black text-sage-600">24h</div>
                  <div className="text-sm text-earth-600">🚚 Fast Delivery</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-beige-100/50 via-cream-100/50 to-sage-100/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-600 to-sage-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm md:text-base text-earth-600 font-medium mt-2 group-hover:text-beige-600 transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section 
        className="bg-gradient-to-br from-white via-beige-50/30 to-cream-50/50 py-24 sm:py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-base font-semibold leading-7 text-beige-600"
              whileInView={{ scale: [0.9, 1] }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Choose StellarSoil
            </motion.h2>
            <motion.p 
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-beige-700 to-sage-700"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Experience the Farm-Fresh Difference
            </motion.p>
            <motion.p 
              className="mt-6 text-lg leading-8 text-earth-600"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              We connect you directly with local farmers, ensuring you get the freshest produce while supporting sustainable agriculture.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name} 
                  className="flex flex-col group cursor-pointer"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-beige-200/50 group-hover:shadow-xl group-hover:border-beige-300/70 transition-all duration-300"
                    whileHover={{ 
                      boxShadow: "0 25px 50px -12px rgba(176, 141, 70, 0.25)"
                    }}
                  >
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 mb-4">
                      <motion.div 
                        className={`${feature.color} p-3 rounded-xl shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </motion.div>
                      <span className="group-hover:text-beige-700 transition-colors duration-300">
                        {feature.name}
                      </span>
                    </dt>
                    <dd className="flex flex-auto flex-col text-base leading-7">
                      <p className="flex-auto text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </dd>
                  </motion.div>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section 
        className="bg-gradient-to-b from-beige-50/30 to-sage-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-beige-200/20 to-sage-200/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 relative z-10">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-beige-700 to-sage-700"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to experience farm-fresh quality?
            </motion.h2>
            <motion.p 
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-earth-600"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join StellarSoil today and discover the difference of truly fresh, locally sourced produce.
            </motion.p>
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                className="rounded-2xl bg-gradient-to-r from-beige-500 to-sage-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-beige-500/25 hover:from-beige-600 hover:to-sage-600 hover:shadow-beige-500/35 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                🌟 Get started today
                <span className="ml-2 inline-block">→</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Home;
