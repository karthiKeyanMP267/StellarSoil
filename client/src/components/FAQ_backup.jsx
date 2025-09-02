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
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-2xl animate-bounce-gentle">
              <QuestionMarkCircleIcon className="h-16 w-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 mb-6 tracking-tight drop-shadow-2xl animate-pulse">
            ❓ Frequently Asked Questions
          </h2>
          <p className="text-2xl text-amber-700 max-w-3xl mx-auto font-bold tracking-wide leading-relaxed">
            ✨ Everything you need to know about StellarSoil marketplace
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="group bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-amber-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-8 focus:outline-none focus:ring-4 focus:ring-amber-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl md:text-2xl font-black text-amber-900 group-hover:text-amber-800 transition-colors tracking-wide pr-8">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUpIcon className="h-8 w-8 text-amber-600 group-hover:text-amber-800 transition-all transform group-hover:scale-110" />
                    ) : (
                      <ChevronDownIcon className="h-8 w-8 text-amber-600 group-hover:text-amber-800 transition-all transform group-hover:scale-110" />
                    )}
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-8">
                  <div className="w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 mb-6"></div>
                  <p className="text-lg text-amber-800 leading-relaxed font-medium tracking-wide">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-amber-100/80 to-orange-100/80 backdrop-blur-xl rounded-3xl p-12 border border-amber-200/50 shadow-2xl">
            <div className="flex justify-center mb-6">
              <SparklesIcon className="h-12 w-12 text-amber-600 animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-amber-900 mb-4 tracking-wide">
              🤔 Still have questions?
            </h3>
            <p className="text-xl text-amber-700 mb-8 font-medium max-w-2xl mx-auto leading-relaxed">
              Our friendly customer support team is here to help you 24/7. Get in touch with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black rounded-2xl shadow-2xl hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 hover:scale-110 text-lg tracking-wide group">
                <span className="flex items-center justify-center">
                  📞 Contact Support
                  <SparklesIcon className="h-5 w-5 ml-2 group-hover:animate-spin" />
                </span>
              </button>
              <button className="px-10 py-5 bg-white/90 backdrop-blur-lg border-2 border-amber-300/50 text-amber-800 font-black rounded-2xl hover:bg-white/95 hover:border-amber-400 transition-all duration-300 shadow-xl tracking-wide hover:scale-110 text-lg">
                💬 Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
