import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  CloudIcon,
  UserGroupIcon,
  SunIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  SparklesIcon,
  HeartIcon,
  GlobeAltIcon,
  TruckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import AuthModal from '../components/AuthModal';

const features = [
  {
    name: 'Fresh & Local',
    description: 'Get fresh, locally sourced produce directly from trusted farmers.',
    icon: SparklesIcon,
    color: 'from-beige-500 to-beige-600',
    emoji: '🌱'
  },
  {
    name: 'Expert Farmers',
    description: 'Connect with experienced farmers who follow sustainable practices.',
    icon: UserGroupIcon,
    color: 'from-sage-500 to-sage-600',
    emoji: '👨‍🌾'
  },
  {
    name: 'Seasonal Variety',
    description: 'Access seasonal fruits, vegetables, and organic products year-round.',
    icon: SunIcon,
    color: 'from-cream-500 to-cream-600',
    emoji: '🌺'
  },
  {
    name: 'Quality Assured',
    description: 'Every product meets our high standards for quality and freshness.',
    icon: ShieldCheckIcon,
    color: 'from-earth-500 to-earth-600',
    emoji: '✅'
  },
];

const stats = [
  { label: 'Happy Customers', value: '10,000+', emoji: '😊' },
  { label: 'Partner Farms', value: '500+', emoji: '🚜' },
  { label: 'Products Available', value: '2,000+', emoji: '🥕' },
  { label: 'Cities Served', value: '50+', emoji: '🏙️' },
];

const Home = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  return (
    <motion.div 
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-cream-50 via-white to-beige-50 pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-10 -left-10 w-72 h-72 bg-gradient-to-r from-beige-300/30 to-sage-300/30 rounded-full blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 -right-10 w-96 h-96 bg-gradient-to-r from-cream-300/30 to-earth-300/30 rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              {['🌾', '🍃', '🌱', '💚', '🌿', '✨', '🥕', '🍎'][i]}
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-cream-100/20"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-earth-100/20"></div>
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
                <div className="relative rounded-2xl shadow-2xl w-full h-[400px] bg-gradient-to-br from-beige-100 to-sage-200 flex items-center justify-center">
                  <SparklesIcon className="w-24 h-24 text-beige-600 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-white via-beige-50/30 to-cream-50/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-beige-600">Why Choose StellarSoil</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Experience the Farm-Fresh Difference
            </p>
            <p className="mt-6 text-lg leading-8 text-earth-600">
              We connect you directly with local farmers, ensuring you get the freshest produce while supporting sustainable agriculture.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className={`${feature.color} p-2 rounded-lg`}>
                      <feature.icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-beige-50/30 to-sage-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to experience farm-fresh quality?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-earth-600">
              Join StellarSoil today and discover the difference of truly fresh, locally sourced produce.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                className="rounded-full bg-gradient-to-r from-beige-500 to-sage-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-beige-600 hover:to-sage-600 transition-all duration-300"
              >
                Get started today
                <span className="ml-2 inline-block">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Home;
