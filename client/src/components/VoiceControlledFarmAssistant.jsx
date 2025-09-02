import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MicrophoneIcon,
  SpeakerWaveIcon,
  StopIcon,
  PlayIcon,
  CommandLineIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const VoiceControlledFarmAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [assistantPersonality, setAssistantPersonality] = useState('helpful');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if (synthRef.current && text) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    let response = '';
    let action = null;

    // Weather commands
    if (lowerCommand.includes('weather')) {
      response = "Today's weather shows partly cloudy skies with a high of 75°F. Perfect conditions for your tomato harvest! There's a 20% chance of light rain this evening, which would be great for your newly planted seedlings.";
      action = { type: 'weather', data: { temp: 75, condition: 'partly-cloudy', rain: 20 } };
    }
    // Irrigation commands
    else if (lowerCommand.includes('water') || lowerCommand.includes('irrigation')) {
      if (lowerCommand.includes('start') || lowerCommand.includes('turn on')) {
        response = "I've started the irrigation system for zone 2. The drip irrigation will run for 15 minutes to provide optimal moisture for your lettuce crop.";
        action = { type: 'irrigation', status: 'started', zone: 2, duration: 15 };
      } else if (lowerCommand.includes('stop') || lowerCommand.includes('turn off')) {
        response = "Irrigation system has been stopped. Zone 2 received adequate water. Soil moisture levels are now optimal.";
        action = { type: 'irrigation', status: 'stopped', zone: 2 };
      } else {
        response = "Current irrigation status: Zone 1 is scheduled for 6 AM tomorrow. Zone 2 soil moisture is at 65% - optimal level. Zone 3 needs attention - moisture at 35%.";
        action = { type: 'irrigation', status: 'status' };
      }
    }
    // Crop monitoring
    else if (lowerCommand.includes('crop') || lowerCommand.includes('plant')) {
      response = "Your crops are looking healthy! Tomatoes in section A are flowering beautifully. The lettuce in section B is ready for harvest. I've detected early signs of aphids on the pepper plants - consider applying organic neem oil.";
      action = { type: 'crop-monitor', alert: 'aphids-detected', location: 'pepper-plants' };
    }
    // Harvest scheduling
    else if (lowerCommand.includes('harvest')) {
      response = "Based on current growth patterns, your lettuce will be ready for harvest in 2 days. Tomatoes in 5-7 days. I'll remind you and help schedule the optimal harvest time for maximum yield.";
      action = { type: 'harvest', crops: [{ name: 'lettuce', days: 2 }, { name: 'tomatoes', days: 7 }] };
    }
    // Market prices
    else if (lowerCommand.includes('price') || lowerCommand.includes('market')) {
      response = "Current market prices: Organic lettuce is $4.50 per pound, up 12% from last week. Tomatoes are $3.20 per pound. Perfect timing for your lettuce harvest!";
      action = { type: 'market', prices: { lettuce: 4.50, tomatoes: 3.20 } };
    }
    // General farm status
    else if (lowerCommand.includes('status') || lowerCommand.includes('report')) {
      response = "Farm status: All systems operational. 3 zones properly irrigated. 85% of crops are healthy. One minor pest alert in pepper section. Today's tasks: harvest lettuce, check tomato stakes, apply organic fertilizer to zone 3.";
      action = { type: 'status', health: 85, alerts: 1, tasks: 3 };
    }
    // Equipment status
    else if (lowerCommand.includes('equipment') || lowerCommand.includes('machinery')) {
      response = "Equipment status: Irrigation pump is running normally. Greenhouse ventilation system is automatic mode. Tractor needs oil change in 15 hours of operation. All sensors are online and functioning.";
      action = { type: 'equipment', status: 'all-operational', maintenance: ['tractor-oil-change'] };
    }
    else {
      response = "I'm here to help with your farm management! You can ask me about weather, irrigation, crop status, harvest schedules, market prices, or general farm reports. What would you like to know?";
      action = { type: 'help' };
    }

    const newConversation = {
      id: Date.now(),
      command: command,
      response: response,
      action: action,
      timestamp: new Date()
    };

    setResponse(response);
    setConversationHistory(prev => [newConversation, ...prev.slice(0, 9)]);
    speak(response);

    if (action) {
      setVoiceCommands(prev => [action, ...prev.slice(0, 4)]);
    }
  };

  const quickCommands = [
    { text: "What's the weather?", icon: SunIcon, category: 'weather' },
    { text: "Start irrigation", icon: BeakerIcon, category: 'irrigation' },
    { text: "Crop status report", icon: ChartBarIcon, category: 'monitoring' },
    { text: "Market prices", icon: ChartBarIcon, category: 'market' },
    { text: "Schedule harvest", icon: CalendarIcon, category: 'planning' },
    { text: "Equipment status", icon: CommandLineIcon, category: 'equipment' }
  ];

  const personalities = [
    { id: 'helpful', name: 'Helpful', description: 'Friendly and supportive' },
    { id: 'professional', name: 'Professional', description: 'Formal and precise' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-beige-200/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: isListening ? [1, 1.2, 1] : [1, 1.05, 1],
                rotate: isSpeaking ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: isListening ? 0.5 : 2, 
                repeat: isListening || isSpeaking ? Infinity : Infinity 
              }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <MicrophoneIcon className="h-8 w-8" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">Voice Farm Assistant</h2>
              <p className="text-indigo-100">Your hands-free farm management companion</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-indigo-100">Assistant Status</div>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  backgroundColor: isListening ? ['#ef4444', '#f97316', '#ef4444'] : 
                                   isSpeaking ? ['#22c55e', '#16a34a', '#22c55e'] : 
                                   ['#6b7280'] 
                }}
                transition={{ duration: 1, repeat: (isListening || isSpeaking) ? Infinity : 0 }}
                className="w-2 h-2 rounded-full"
              />
              <span className="text-sm font-medium">
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Voice Controls */}
        <div className="text-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className={`p-6 rounded-full shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
            } disabled:opacity-50`}
          >
            {isListening ? (
              <StopIcon className="h-12 w-12" />
            ) : (
              <MicrophoneIcon className="h-12 w-12" />
            )}
          </motion.button>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              {isListening ? 'Listening for your command...' : 'Tap to start voice command'}
            </p>
            {transcript && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 italic"
              >
                "_{transcript}_"
              </motion.p>
            )}
          </div>
        </div>

        {/* Quick Commands */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Quick Voice Commands</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => processVoiceCommand(cmd.text)}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-200 transition-all duration-200"
                >
                  <Icon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">{cmd.text}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Recent Response */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-800">Assistant Response</h3>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div className="flex items-start space-x-3">
                <motion.div
                  animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                >
                  <SpeakerWaveIcon className="h-5 w-5 text-indigo-600 mt-1" />
                </motion.div>
                <p className="text-gray-700 leading-relaxed">{response}</p>
              </div>
              {!isSpeaking && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(response)}
                  className="mt-3 px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  <PlayIcon className="h-4 w-4 inline mr-1" />
                  Repeat
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Voice Commands History */}
        {voiceCommands.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Recent Actions</h3>
            <div className="space-y-2">
              {voiceCommands.map((cmd, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  {cmd.type === 'weather' && <SunIcon className="h-5 w-5 text-yellow-500" />}
                  {cmd.type === 'irrigation' && <BeakerIcon className="h-5 w-5 text-blue-500" />}
                  {cmd.type === 'crop-monitor' && <ChartBarIcon className="h-5 w-5 text-green-500" />}
                  {cmd.type === 'harvest' && <CalendarIcon className="h-5 w-5 text-orange-500" />}
                  {cmd.type === 'market' && <ChartBarIcon className="h-5 w-5 text-purple-500" />}
                  {cmd.type === 'equipment' && <CommandLineIcon className="h-5 w-5 text-gray-500" />}
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 capitalize">{cmd.type.replace('-', ' ')}</p>
                    {cmd.status && (
                      <p className="text-xs text-gray-600">Status: {cmd.status}</p>
                    )}
                  </div>
                  
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Assistant Personality */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Assistant Personality</h3>
          <div className="flex space-x-3">
            {personalities.map((personality) => (
              <motion.button
                key={personality.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAssistantPersonality(personality.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  assistantPersonality === personality.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {personality.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Conversation History</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {conversationHistory.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 mb-1">
                      You: "{conv.command}"
                    </p>
                    <p className="text-gray-600 mb-2">
                      Assistant: {conv.response.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      {conv.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Browser Support Warning */}
        {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <div className="flex items-center space-x-2 text-yellow-600">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="font-medium">Browser not supported</span>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Voice recognition requires Chrome, Safari, or Edge browser for full functionality.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceControlledFarmAssistant;
