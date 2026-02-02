import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  StarIcon, 
  CurrencyDollarIcon, 
  SparklesIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  HeartIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PlayIcon,
  ChevronDownIcon,
  BeakerIcon,
  ArrowTrendingUpIcon,
  GiftIcon,
  ChartBarIcon,
  SunIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const { scrollY } = useScroll();
  const [stats, setStats] = useState({ farmers: 0, products: 0, customers: 0, cities: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Parallax effects with more natural movement
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200]);

  // Update time for dynamic greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Animated counters with more natural progression
  useEffect(() => {
    const targetStats = { farmers: 2847, products: 18340, customers: 73251, cities: 156 };
    const duration = 3000;
    const steps = 100;
    const stepTime = duration / steps;

    const interval = setInterval(() => {
      setStats(current => {
        const newStats = { ...current };
        let allComplete = true;

        Object.keys(targetStats).forEach(key => {
          if (current[key] < targetStats[key]) {
            const increment = Math.ceil(targetStats[key] / steps * (1 + Math.random() * 0.5));
            newStats[key] = Math.min(current[key] + increment, targetStats[key]);
            allComplete = false;
          }
        });

        if (allComplete) clearInterval(interval);
        return newStats;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "Good Night";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const features = [
    {
      icon: CheckCircleIcon,
      title: "100% Organic & Fresh",
      description: "Farm-fresh produce picked at peak ripeness and delivered within 24 hours. No pesticides, no compromises.",
      color: 'from-emerald-400 via-green-500 to-teal-600',
      bgColor: 'from-emerald-50 to-green-50',
      delay: 0.1,
      emoji: "🌱"
    },
    {
      icon: TruckIcon,
      title: "Farm-to-Door Delivery",
      description: "Direct from local farms to your kitchen. Support sustainable agriculture while enjoying the freshest produce.",
      color: 'from-amber-400 via-orange-500 to-red-500',
      bgColor: 'from-amber-50 to-orange-50',
      delay: 0.2,
      emoji: "🚚"
    },
    {
      icon: GlobeAltIcon,
      title: "Earth-Friendly Practices",
      description: "Every purchase supports regenerative farming practices that heal the soil and protect our planet.",
      color: 'from-blue-400 via-sky-500 to-cyan-600',
      bgColor: 'from-blue-50 to-sky-50',
      delay: 0.3,
      emoji: "🌍"
    },
    {
      icon: SparklesIcon,
      title: "AI-Powered Freshness",
      description: "Smart technology ensures optimal harvest timing and perfect storage conditions for maximum nutrition.",
      color: 'from-purple-400 via-violet-500 to-indigo-600',
      bgColor: 'from-purple-50 to-violet-50',
      delay: 0.4,
      emoji: "✨"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Sustainability Chef",
      image: "👩‍🍳",
      quote: "The vegetables taste like they were just picked from my own garden. The quality is absolutely incredible!",
      rating: 5,
      location: "San Francisco, CA"
    },
    {
      name: "Marcus Thompson",
      role: "Farm-to-Table Owner", 
      image: "👨‍🍳",
      quote: "StellarSoil connects me directly with local farmers. My customers can taste the difference in every dish.",
      rating: 5,
      location: "Portland, OR"
    },
    {
      name: "Elena Rodriguez",
      role: "Organic Farmer",
      image: "👩‍🌾",
      quote: "This platform helped me reach customers who truly appreciate sustainable farming. It's changed my business!",
      rating: 5,
      location: "Austin, TX"
    }
  ];

  const AnimatedSection = ({ children, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
      once: true,
      margin: "-50px"
    });

    return (
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen theme-background overflow-hidden relative transition-all duration-500">
      {/* Organic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating organic shapes */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -80, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-40 h-40 theme-blob-1 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -120, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-60 h-60 theme-blob-2 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            x: [0, 80, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.3, 0.9, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-32 h-32 theme-blob-3 rounded-full blur-xl"
        />
        
        {/* Floating leaf particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className={`absolute w-3 h-3 ${
              i % 4 === 0 ? 'text-green-400/60' : 
              i % 4 === 1 ? 'text-amber-400/60' : 
              i % 4 === 2 ? 'text-blue-400/60' : 'text-purple-400/60'
            }`}
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 6)}%`,
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      {/* Hero Section - Completely Redesigned */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-12"
      >
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          {/* Natural gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-100/30 to-emerald-200/40" />
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-7xl mx-auto">
            {/* Dynamic greeting with time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-3 theme-greeting-card backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border theme-border">
                <SunIcon className="h-5 w-5 text-amber-500" />
                <span className="theme-text-primary font-medium">{getTimeBasedGreeting()}! Welcome to the future of fresh.</span>
              </div>
            </motion.div>

            {/* Enhanced Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex justify-center mb-12"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1, 1.05, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="p-12 bg-gradient-to-br from-white/80 via-green-50/90 to-emerald-100/80 backdrop-blur-xl rounded-full border-2 border-green-200/50 shadow-2xl"
                >
                  <div className="text-6xl">🌾</div>
                </motion.div>
                
                {/* Pulsing rings */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-6 bg-gradient-to-r from-green-300/20 to-emerald-400/20 rounded-full blur-xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -inset-8 bg-gradient-to-r from-amber-300/15 to-orange-400/15 rounded-full blur-2xl"
                />
              </div>
            </motion.div>

            {/* Hero Text with Natural Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800">
                Cultivating
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-700 to-red-700">
                Sustainable
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800">
                Agriculture
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-12"
            >
              <p className="text-xl md:text-3xl text-gray-700 font-light max-w-5xl mx-auto leading-relaxed mb-6">
                Experience the harmony of <span className="font-semibold text-green-700">nature's finest produce</span> delivered fresh from local farms to your table. 
                Where <span className="font-semibold text-amber-700">sustainability meets flavor</span>, 
                and every bite tells a story of the earth.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Farm Fresh Daily</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                  <span>Zero Pesticides</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Carbon Neutral</span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link 
                  to="/marketplace" 
                  className="relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white font-bold text-lg rounded-full overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-green-500/25"
                >
                  <span className="relative z-10 flex items-center">
                    <span className="mr-3">🛒</span>
                    Start Shopping Fresh
                    <ArrowRightIcon className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Sparkle effect */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 right-2 w-2 h-2 bg-white/50 rounded-full"
                  />
                </Link>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <button className="relative inline-flex items-center px-10 py-5 bg-white/90 backdrop-blur-lg border-2 border-green-200 text-green-700 font-bold text-lg rounded-full transition-all duration-500 hover:bg-green-50 shadow-xl hover:shadow-2xl hover:border-green-300">
                  <span className="flex items-center">
                    <PlayIcon className="h-5 w-5 mr-3" />
                    <span className="mr-2">🎥</span>
                    Watch Our Story
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* Enhanced Scroll Indicator */}
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center space-y-2"
            >
              <span className="text-sm text-gray-500 font-medium">Discover More</span>
              <div className="flex flex-col space-y-1">
                <ChevronDownIcon className="h-6 w-6 text-green-600" />
                <ChevronDownIcon className="h-4 w-4 text-green-400 opacity-60" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Stats Section with Live Feel */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 border-y border-green-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
              Growing Together, Thriving Together
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our vibrant community of farmers, food lovers, and sustainability champions making a real difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { 
                key: 'farmers', 
                icon: '👨‍🌾', 
                label: 'Happy Farmers',
                color: 'from-green-500 to-emerald-600',
                description: 'Thriving sustainable farms'
              },
              { 
                key: 'products', 
                icon: '🥕', 
                label: 'Fresh Products',
                color: 'from-orange-500 to-amber-600',
                description: 'Farm-fresh items delivered'
              },
              { 
                key: 'customers', 
                icon: '😊', 
                label: 'Satisfied Customers',
                color: 'from-blue-500 to-cyan-600',
                description: 'Families eating healthier'
              },
              { 
                key: 'cities', 
                icon: '🏙️', 
                label: 'Cities Served',
                color: 'from-purple-500 to-indigo-600',
                description: 'Communities connected'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100 group-hover:border-green-200">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-5xl mb-4 flex justify-center"
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <motion.div
                    className="text-4xl md:text-5xl font-black mb-2"
                    animate={{ 
                      textShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        "0 0 10px rgba(34, 197, 94, 0.3)",
                        "0 0 0px rgba(0,0,0,0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                      {stats[stat.key].toLocaleString()}+
                    </span>
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                  
                  {/* Live indicator */}
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                    <span className="text-xs text-green-600 font-medium">Live count</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Live update indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-3 bg-green-100/70 backdrop-blur-sm rounded-full px-6 py-3 border border-green-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"
              />
              <span className="text-green-700 font-medium">Numbers updating in real-time</span>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Redesigned Features Section */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-6 py-2 mb-6">
              <SparklesIcon className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">Why Choose StellarSoil</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
              Nature's Best,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">
                Delivered Fresh
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Experience the perfect harmony of cutting-edge technology and traditional farming wisdom. 
              Every product tells a story of sustainability, freshness, and care.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${feature.bgColor} p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50`}>
                  {/* Background pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div className="text-8xl">{feature.emoji}</div>
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:shadow-2xl transition-shadow`}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-700 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Learn more link */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6"
                    >
                      <button className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group-hover:underline transition-colors">
                        <span>Learn more</span>
                        <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Feature highlight banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-12 text-center text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🌱
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Sustainable Revolution
              </h3>
              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
                Every purchase supports regenerative farming practices, reduces carbon footprint, 
                and helps build a more sustainable food system for future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-600 font-bold rounded-full hover:bg-green-50 transition-colors shadow-lg"
                >
                  Start Your Journey
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-green-600 transition-colors"
                >
                  Learn Our Impact
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* AI Features Section */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-earth-800 mb-6">
              AI-Powered Smart Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of agriculture with our cutting-edge AI technology designed for both farmers and consumers
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            {/* For Users */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mr-4"
                >
                  <SparklesIcon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-earth-800">For Smart Consumers</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-700">AI Shopping Assistant</h4>
                    <p className="text-gray-600 text-sm">Personalized recommendations based on your preferences and shopping history</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-700">Nutrition Tracking</h4>
                    <p className="text-gray-600 text-sm">Track your nutritional intake with detailed analytics and health insights</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GiftIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-700">Seasonal Subscription Box</h4>
                    <p className="text-gray-600 text-sm">Curated monthly boxes of fresh, seasonal produce delivered to your door</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* For Farmers */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-green-200/50"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg mr-4"
                >
                  <BeakerIcon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-earth-800">For Smart Farmers</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BeakerIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-700">Crop Health Monitoring</h4>
                    <p className="text-gray-600 text-sm">AI-powered disease detection and plant health analysis with recommendations</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-700">Market Demand Forecasting</h4>
                    <p className="text-gray-600 text-sm">Predictive analytics to optimize crop planning and maximize profits</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-700">Sustainability Tracking</h4>
                    <p className="text-gray-600 text-sm">Monitor environmental impact and earn sustainability certifications</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6"
            >
              <SparklesIcon className="h-10 w-10" />
            </motion.div>
            <h3 className="text-3xl font-bold mb-4">Powered by Advanced AI Technology</h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Our machine learning algorithms continuously learn from data to provide you with the most accurate recommendations, 
              predictions, and insights for smarter agricultural decisions.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* AI-Powered Features Section */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-white via-beige-50/50 to-sage-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-earth-700 via-beige-600 to-sage-600 mb-6">
              AI-Powered Smart Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of agriculture with our cutting-edge AI technology designed for both consumers and farmers
            </p>
          </motion.div>

          {/* For Users Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center text-earth-700 mb-8">For Smart Shoppers</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50 hover:shadow-glow-beige transition-all duration-300"
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg w-fit mb-6">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-4">Personalized Shopping Assistant</h4>
                <p className="text-beige-600 leading-relaxed mb-4">
                  AI-powered recommendations based on your preferences, health goals, and purchase history. Smart suggestions that understand your lifestyle.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Smart Recommendations</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Health Goals</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">95% Accuracy</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50 hover:shadow-glow-beige transition-all duration-300"
              >
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg w-fit mb-6">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-4">Nutritional Tracking</h4>
                <p className="text-beige-600 leading-relaxed mb-4">
                  Track your daily nutrition intake with beautiful charts and personalized recommendations to achieve your health goals.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Vitamin Tracking</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Goal Setting</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Progress Charts</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50 hover:shadow-glow-beige transition-all duration-300"
              >
                <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-lg w-fit mb-6">
                  <GiftIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-4">Seasonal Subscription Box</h4>
                <p className="text-beige-600 leading-relaxed mb-4">
                  Curated monthly boxes of the finest seasonal produce, customized to your taste preferences and dietary needs.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Monthly Delivery</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Seasonal Fresh</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Customizable</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* For Farmers Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-center text-earth-700 mb-8">For Smart Farmers</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50 hover:shadow-glow-beige transition-all duration-300"
              >
                <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl shadow-lg w-fit mb-6">
                  <BeakerIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-4">Crop Health Monitoring</h4>
                <p className="text-beige-600 leading-relaxed mb-4">
                  AI-powered disease detection and plant health analysis. Upload crop images for instant health assessments and treatment recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Disease Detection</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Health Scoring</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">AI Analysis</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50 hover:shadow-glow-beige transition-all duration-300"
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg w-fit mb-6">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-4">Market Demand Forecasting</h4>
                <p className="text-beige-600 leading-relaxed mb-4">
                  Predictive analytics for crop planning and market insights. Make data-driven decisions about what to grow and when to sell.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Price Prediction</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Demand Analytics</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Crop Planning</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-white/95 to-beige-50/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-beige-200/50 hover:shadow-glow-beige transition-all duration-300"
              >
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg w-fit mb-6">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-earth-700 mb-4">Sustainability Score Tracker</h4>
                <p className="text-beige-600 leading-relaxed mb-4">
                  Monitor your environmental impact with comprehensive sustainability metrics, carbon footprint tracking, and certification management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Eco Tracking</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Certifications</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Carbon Footprint</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action for Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-earth-100 to-beige-100 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-earth-700 mb-4">Experience the Future of Agriculture</h3>
              <p className="text-beige-600 mb-6 max-w-2xl mx-auto">
                Join our platform to access these cutting-edge AI features and transform your farming or shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Join as Farmer
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Start Shopping
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Enhanced Testimonials Section */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-6 py-2 mb-6">
              <HeartIcon className="h-5 w-5 text-red-500" />
              <span className="text-blue-700 font-medium">Community Love</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-8">
              Stories from Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Growing Family
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Real people, real stories, real impact. Discover how StellarSoil is transforming 
              the way communities connect with fresh, sustainable food.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -10 }}
                className="group relative"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-blue-200 h-full">
                  {/* Quote decoration */}
                  <div className="absolute top-6 right-6 text-6xl text-blue-100 opacity-50">"</div>
                  
                  <div className="relative z-10">
                    {/* Avatar and info */}
                    <div className="flex items-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="text-5xl mr-4 p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl"
                      >
                        {testimonial.image}
                      </motion.div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                        <p className="text-blue-600 font-medium text-sm">{testimonial.role}</p>
                        <p className="text-gray-500 text-xs flex items-center mt-1">
                          <span className="mr-1">📍</span>
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Star rating */}
                    <div className="flex mb-6 justify-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                        >
                          <StarIcon className="h-6 w-6 text-yellow-400 fill-current mr-1" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-gray-700 italic leading-relaxed text-center mb-6 text-lg">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Verified badge */}
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 border border-green-200">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-green-700 text-xs font-medium">Verified Customer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social proof indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
                  <p className="text-gray-600">Average Rating</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50k+</div>
                  <p className="text-gray-600">Happy Reviews</p>
                  <div className="flex justify-center mt-2 space-x-1">
                    <span className="text-xl">😊</span>
                    <span className="text-xl">🌟</span>
                    <span className="text-xl">❤️</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                  <p className="text-gray-600">Recommend Us</p>
                  <div className="flex justify-center mt-2 space-x-1">
                    <span className="text-xl">👍</span>
                    <span className="text-xl">✅</span>
                    <span className="text-xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Enhanced CTA Section */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/15 rounded-full blur-xl" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Floating elements */}
            <div className="relative mb-12">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-8"
              >
                🌱
              </motion.div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Ready to Experience
              <br />
              <span className="text-yellow-300">Nature's Best?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              Join our community of conscious consumers and discover the difference that 
              fresh, sustainable, locally-sourced produce makes in your life.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  to="/marketplace"
                  className="relative inline-flex items-center px-12 py-6 bg-white text-green-600 font-bold text-xl rounded-full hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-white/25"
                >
                  <span className="flex items-center">
                    <span className="mr-3">🛒</span>
                    Start Shopping Fresh
                    <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center px-12 py-6 border-2 border-white text-white font-bold text-xl rounded-full hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <span className="mr-3">👨‍🌾</span>
                    Join as Farmer
                  </span>
                </Link>
              </motion.div>
            </div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-white/80"
            >
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-300" />
                <span>Free delivery on orders $50+</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-300" />
                <span>100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="h-5 w-5 text-green-300" />
                <span>Support local farmers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default LandingPage;
