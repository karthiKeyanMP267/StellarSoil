import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  MicrophoneIcon,
  StopIcon,
  ShoppingCartIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const AISmartChatbot = ({ userRole = 'customer' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const { setCartItems, addToCart } = useCart();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => setIsListening(false);
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            coordinates: [position.coords.longitude, position.coords.latitude],
            address: 'Current Location'
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const initializeChat = () => {
    const greeting = getContextualGreeting();
    const welcomeMessage = {
      id: 1,
      text: greeting,
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    };

    setMessages([welcomeMessage]);
  };

  const getContextualGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Good morning! ☀️';
    else if (hour < 17) timeGreeting = 'Good afternoon! 😊';
    else timeGreeting = 'Good evening! 🌙';

    if (userRole === 'farmer') {
      return `${timeGreeting} I'm Alex, your AI farming assistant! 🌱 I can help you list products, check market prices, and manage your farm inventory. I can also process orders when customers ask for your products. What would you like to do today?`;
    } else {
      return `${timeGreeting} I'm Sage, your AI shopping assistant! 🛒 I can help you find fresh produce, place orders, get recipes, and connect you with local farmers. Just tell me what you need - like "I need 2kg tomatoes" and I'll find the best options near you!`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { Authorization: `Bearer ${user.token}` })
        },
        body: JSON.stringify({
          message: message,
          userRole: userRole,
          conversationHistory: messages.slice(-10), // Last 10 messages for context
          userLocation: userLocation,
          pendingConfirmation: pendingConfirmation // Send any pending confirmation data
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.data.message,
          sender: 'bot',
          timestamp: new Date(),
          intent: data.data.intent,
          actions: data.data.actions || [],
          availableProducts: data.data.availableProducts || [],
          bestMatch: data.data.bestMatch || null,
          orderData: data.data.orderData || null,
          product: data.data.product || null,
          listingStatus: data.data.listingStatus || null,
          requiresConfirmation: data.data.requiresConfirmation || false,
          orderProcessed: data.data.orderProcessed || false,
          listingProcessed: data.data.listingProcessed || false,
          cartTotal: data.data.cartTotal || null
        };

        setMessages(prev => [...prev, botMessage]);
        setConnectionStatus('connected');

        // If chatbot response includes cart, update cart context
        if (data.data.orderProcessed && data.data.cart && Array.isArray(data.data.cart.items)) {
          try {
            // Convert backend cart items to frontend format
            const newCartItems = data.data.cart.items.map(item => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product?.price || item.price,
              quantity: item.quantity,
              unit: item.product.unit,
              image: item.product.image || '/placeholder.jpg',
              farmerId: item.product.farmer || '',
              category: item.product.category || ''
            }));
            
            console.log('Updating cart with new items:', newCartItems);
            // Update cart context with the new items
            setCartItems(newCartItems);
            
            // Also store in localStorage for persistence
            localStorage.setItem('cart', JSON.stringify(newCartItems));
            
            // Force a refresh of the cart page if needed
            window.dispatchEvent(new CustomEvent('cart-updated', { 
              detail: { items: newCartItems }
            }));
          } catch (error) {
            console.error('Error updating cart items:', error);
          }
        }

        // Handle confirmation workflow
        if (data.data.requiresConfirmation && data.data.pendingConfirmation) {
          setPendingConfirmation(data.data.pendingConfirmation);
        } else if (data.data.orderProcessed || data.data.listingProcessed) {
          setPendingConfirmation(null); // Clear pending confirmation after processing
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setConnectionStatus('error');
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const response = await fetch('/api/chat/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const data = await response.json();

      if (data.success) {
        // Add to local cart as well to ensure consistency
        if (data.data.cart && data.data.cart.items) {
          const newItem = data.data.cart.items.find(item => item.product._id === productId);
          if (newItem) {
            addToCart({
              id: productId,
              name: newItem.product.name,
              price: newItem.product.price || newItem.price,
              quantity: quantity,
              unit: newItem.product.unit || 'kg',
              image: newItem.product.image || '/placeholder.jpg'
            });
          }
        }

        const confirmMessage = {
          id: Date.now(),
          text: data.data.message,
          sender: 'bot',
          timestamp: new Date(),
          type: 'success'
        };
        setMessages(prev => [...prev, confirmMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      
      // If server error, still try to add to local cart
      if (error.message.includes('Network Error') || error.message.includes('Connection refused')) {
        // Attempt to create a minimal item for the cart
        const localCartItem = {
          id: productId,
          name: 'Product', // Basic fallback name
          price: 0, // We don't know the price
          quantity: quantity,
          unit: 'kg',
          image: '/placeholder.jpg'
        };
        
        // Add to local cart context
        addToCart(localCartItem);
        
        const warningMessage = {
          id: Date.now(),
          text: `Added to cart locally. Server connection unavailable, so the cart will be synchronized when connection is restored.`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'warning'
        };
        setMessages(prev => [...prev, warningMessage]);
      } else {
        const errorMessage = {
          id: Date.now(),
          text: `Sorry, I couldn't add that to your cart: ${error.message}`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const ProductCard = ({ product, orderData }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border mb-3 ${
        theme === 'dark' 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {product.name}
          </h4>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            By {product.farmerName} {product.distance && `• ${product.distance}km away`}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            ₹{product.price}/{product.unit}
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {product.availableQuantity}{product.unit} available
          </p>
        </div>
      </div>
      
      {product.organic && (
        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
          🌱 Organic
        </span>
      )}
      
      {user && orderData && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAddToCart(product.id, orderData.requestedQuantity)}
          className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2 inline" />
          Add {orderData.requestedQuantity}{orderData.requestedUnit} to Cart
        </motion.button>
      )}
    </motion.div>
  );

  const MessageContent = ({ message }) => {
    return (
      <div className="space-y-3">
        <p className="whitespace-pre-line">{message.text}</p>
        
        {/* Product Listings for Farmers */}
        {message.product && message.listingStatus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl border ${
              message.listingStatus === 'created' || message.listingStatus === 'updated'
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Product Listed Successfully!</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p><strong>{message.product.name}</strong></p>
                  <p>Quantity: {message.product.quantity}{message.product.unit}</p>
                  <p>Price: ₹{message.product.price} per {message.product.unit}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Products for Customers */}
        {message.availableProducts && message.availableProducts.length > 0 && (
          <div className="space-y-3">
            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              🌱 Available Products Near You:
            </h4>
            {message.availableProducts.slice(0, 3).map((product, index) => (
              <ProductCard 
                key={index} 
                product={product} 
                orderData={message.orderData}
              />
            ))}
            {message.availableProducts.length > 3 && (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                And {message.availableProducts.length - 3} more options available...
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.actions.slice(0, 4).map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage(action)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {action}
              </motion.button>
            ))}
          </div>
        )}

        {/* Confirmation Buttons */}
        {message.requiresConfirmation && pendingConfirmation && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleSendMessage('yes')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Yes, confirm
            </button>
            <button
              onClick={() => handleSendMessage('no')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              No, cancel
            </button>
          </div>
        )}
        
        {/* Order Success Message */}
        {message.orderProcessed && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✅ Order added to cart successfully!
              {message.cartTotal && ` Total: ₹${message.cartTotal}`}
            </p>
          </div>
        )}
        
        {/* Listing Success Message */}
        {message.listingProcessed && (
          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              ✅ Product listed successfully!
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl text-white transition-all duration-300 border-2 border-white/20 ${
          connectionStatus === 'error' 
            ? 'bg-gradient-to-r from-red-500 to-red-600' 
            : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:shadow-emerald-500/25'
        }`}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                {connectionStatus === 'error' && (
                  <ExclamationTriangleIcon className="h-4 w-4" />
                )}
              </div>
            )}
          </AnimatePresence>
          
          {!isOpen && connectionStatus === 'connected' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"
            />
          )}
        </div>
        
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`fixed bottom-24 right-6 z-40 w-96 h-[600px] rounded-3xl shadow-2xl border flex flex-col overflow-hidden ${
              theme === 'dark'
                ? 'bg-gray-800/95 border-gray-700/50 backdrop-blur-xl'
                : 'bg-white/95 border-beige-200/50 backdrop-blur-xl'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative flex items-center space-x-4">
                <div className="relative">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    <SparklesIcon className="h-7 w-7" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-xl">
                    {userRole === 'farmer' ? '🌱 Alex' : '🛒 Sage'}
                  </h3>
                  <p className="text-emerald-100 text-sm font-medium">
                    {isTyping ? '✍️ Typing...' : connectionStatus === 'connected' ? '💬 Ready to help' : '⚠️ Connection issue'}
                  </p>
                </div>
              </div>
              
              {userLocation && (
                <div className="mt-2 flex items-center text-emerald-200 text-xs">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  <span>Location detected</span>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              theme === 'dark' ? 'bg-gray-900/50' : 'bg-gradient-to-b from-gray-50/50 to-white'
            }`}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    message.sender === 'user' 
                      ? `text-white rounded-[20px] rounded-br-[8px] shadow-lg ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`
                      : `text-gray-800 rounded-[20px] rounded-bl-[8px] shadow-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-100'
                        }`
                  } p-5`}>
                    
                    {message.sender === 'bot' && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {userRole === 'farmer' ? '🌱' : '🛒'}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold ${
                          theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          {userRole === 'farmer' ? 'Alex' : 'Sage'}
                        </span>
                      </div>
                    )}
                    
                    <MessageContent message={message} />
                    
                    <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-100/50'
                    }`}>
                      <p className={`text-xs opacity-60 ${
                        message.sender === 'user' 
                          ? 'text-blue-100' 
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-[20px] rounded-bl-[8px] p-5 shadow-lg border max-w-[85%] ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-100'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {userRole === 'farmer' ? '🌱' : '🛒'}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold ${
                        theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        {userRole === 'farmer' ? 'Alex' : 'Sage'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        />
                      ))}
                      <span className={`text-xs ml-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                      }`}>
                        thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder={`Ask ${userRole === 'farmer' ? 'Alex' : 'Sage'} anything...`}
                    className={`w-full px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                    disabled={isTyping}
                  />
                  
                  {/* Voice Input Button */}
                  {recognition.current && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
                        isListening 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : theme === 'dark'
                          ? 'bg-gray-600 text-gray-300 hover:bg-emerald-600 hover:text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                    >
                      {isListening ? (
                        <StopIcon className="h-4 w-4" />
                      ) : (
                        <MicrophoneIcon className="h-4 w-4" />
                      )}
                    </motion.button>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl'
                      : theme === 'dark'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </motion.button>
              </div>
              
              <p className={`text-xs mt-2 text-center ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {userRole === 'farmer' ? '🌱 Alex' : '🛒 Sage'} is powered by Google AI • 
                {userRole === 'farmer' 
                  ? ' Try: "I have 10kg tomatoes for 30 rupees"'
                  : ' Try: "I need 2kg fresh tomatoes"'
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISmartChatbot;
