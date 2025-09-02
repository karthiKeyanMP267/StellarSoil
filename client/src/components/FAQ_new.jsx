import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "🌱 How do I know the produce is fresh and organic?",
      answer: "All our farmers are certified organic producers who follow strict quality standards. Each product comes with a freshness guarantee and harvest date. Our verification team regularly inspects farms to ensure quality and authenticity.",
      color: "from-green-400 to-emerald-500"
    },
    {
      question: "🚚 What are the delivery options and timings?",
      answer: "We offer same-day delivery for orders placed before 2 PM, and next-day delivery for all other orders. Free delivery is available for orders above ₹500. We also provide scheduled delivery slots to fit your convenience.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      question: "💰 How does the pricing work? Are there any hidden charges?",
      answer: "Our pricing is transparent with no hidden fees. You pay the farm price plus a small platform fee and delivery charges (free for orders above ₹500). We believe in fair pricing for both customers and farmers.",
      color: "from-amber-400 to-orange-500"
    },
    {
      question: "🔄 What if I'm not satisfied with my order?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with your purchase, contact us within 24 hours of delivery for a full refund or replacement. Your satisfaction is our priority.",
      color: "from-purple-400 to-pink-500"
    },
    {
      question: "👨‍🌾 Can I connect directly with farmers?",
      answer: "Yes! Our platform allows you to see which farm your produce comes from and read about the farmers. You can also send messages to farmers through our platform to learn more about their farming practices.",
      color: "from-indigo-400 to-purple-500"
    },
    {
      question: "📱 Is there a mobile app available?",
      answer: "Our website is fully mobile-responsive and works perfectly on all devices. We're currently developing a dedicated mobile app that will be available soon with additional features like push notifications for deals.",
      color: "from-teal-400 to-green-500"
    },
    {
      question: "💳 What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, net banking, and digital wallets. All transactions are secured with bank-level encryption for your safety.",
      color: "from-rose-400 to-red-500"
    },
    {
      question: "🌍 Do you support sustainable farming practices?",
      answer: "Absolutely! We partner only with farmers who practice sustainable and eco-friendly farming methods. This includes organic farming, water conservation, and minimal use of harmful chemicals.",
      color: "from-sage-400 to-earth-500"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-beige-400/20 to-sage-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-sage-400/15 to-earth-400/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cream-300/10 to-beige-300/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="p-6 bg-gradient-to-r from-beige-500 to-sage-600 rounded-full shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{ 
                boxShadow: [
                  "0 20px 25px -5px rgba(176, 141, 70, 0.4)",
                  "0 25px 30px -5px rgba(74, 115, 74, 0.4)",
                  "0 20px 25px -5px rgba(176, 141, 70, 0.4)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <QuestionMarkCircleIcon className="h-16 w-16 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-beige-700 via-sage-600 to-earth-700 mb-6 tracking-tight"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            ❓ Frequently Asked Questions
          </motion.h2>
          
          <motion.p 
            className="text-xl text-earth-600 max-w-3xl mx-auto font-medium leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            ✨ Everything you need to know about StellarSoil marketplace
          </motion.p>
        </motion.div>

        {/* Enhanced FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="group"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-beige-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                layout
              >
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-beige-400/50 transition-all duration-300"
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <motion.h3 
                      className="text-lg md:text-xl font-bold text-earth-800 group-hover:text-beige-700 transition-colors pr-4"
                      layoutId={`question-${index}`}
                    >
                      {faq.question}
                    </motion.h3>
                    <motion.div 
                      className="flex-shrink-0"
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`p-2 rounded-xl bg-gradient-to-r ${faq.color} shadow-lg`}
                      >
                        <ChevronDownIcon className="h-5 w-5 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div 
                        className="px-6 pb-6"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <motion.div 
                          className={`w-full h-1 bg-gradient-to-r ${faq.color} mb-4 rounded-full`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                        <motion.p 
                          className="text-base text-earth-700 leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-gradient-to-br from-beige-100/80 to-sage-100/80 backdrop-blur-xl rounded-3xl p-12 border border-beige-200/50 shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-beige-200/20 to-sage-200/20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <motion.div 
              className="flex justify-center mb-6 relative z-10"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <SparklesIcon className="h-12 w-12 text-beige-600" />
              </motion.div>
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-black text-earth-800 mb-4 tracking-wide relative z-10"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              🤔 Still have questions?
            </motion.h3>
            
            <motion.p 
              className="text-lg text-earth-600 mb-8 font-medium max-w-2xl mx-auto leading-relaxed relative z-10"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our friendly customer support team is here to help you 24/7. Get in touch with us!
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-beige-500 to-sage-600 text-white font-bold rounded-2xl shadow-xl hover:from-beige-600 hover:to-sage-700 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center">
                  📞 Contact Support
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    <SparklesIcon className="h-5 w-5" />
                  </motion.div>
                </span>
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 bg-white/90 backdrop-blur-lg border-2 border-beige-300/50 text-earth-800 font-bold rounded-2xl hover:bg-white/95 hover:border-beige-400 transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Live Chat
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
