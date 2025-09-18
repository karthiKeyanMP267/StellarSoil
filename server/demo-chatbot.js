// demo-chatbot.js
// A comprehensive demo script for testing the StellarSoil AI chatbot

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiChatService from './services/aiChatService.js';
import readline from 'readline';
import chalk from 'chalk';

// Set up proper environment loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Log that env was loaded
console.log(`Environment loaded from: ${envPath}`);
console.log(`AI Model: ${process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash-latest'}`);
console.log(`Google Gemini API Key available: ${!!process.env.GOOGLE_GEMINI_API_KEY}`);

// Create readline interface for interactive chat
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Track conversation history
const conversationHistory = [];

// Color formatting
const colors = {
  system: chalk.yellow,
  user: chalk.green,
  assistant: chalk.cyan,
  error: chalk.red,
  info: chalk.blue,
  success: chalk.green,
  warn: chalk.magenta
};

// Demo user locations
const userLocations = {
  customer: {
    type: 'Point',
    coordinates: [77.2090, 28.6139] // Delhi
  },
  farmer: {
    type: 'Point',
    coordinates: [77.1025, 28.7041] // Outskirts of Delhi
  }
};

// Helper to print formatted messages
const printMessage = (role, message) => {
  const colorFn = colors[role] || colors.info;
  console.log(colorFn(`[${role.toUpperCase()}]: ${message}`));
};

// Example user roles
const userRoles = ['customer', 'farmer'];
let currentUserRole = 'customer';

// Demo function to switch between roles
const switchRole = () => {
  currentUserRole = currentUserRole === 'customer' ? 'farmer' : 'customer';
  printMessage('system', `Switched role to: ${currentUserRole}`);
  return currentUserRole;
};

// Print welcome message
const printWelcome = () => {
  console.log('\n' + colors.info('======================================'));
  console.log(colors.success('🌾 StellarSoil AI Chatbot Demo 🌾'));
  console.log(colors.info('======================================\n'));
  
  printMessage('system', 'Welcome to the StellarSoil AI Chatbot Demo!');
  printMessage('system', `You are currently in ${currentUserRole} mode.`);
  printMessage('system', 'Type a message to chat with the AI assistant.');
  printMessage('system', 'Type "/switch" to change between customer and farmer modes.');
  printMessage('system', 'Type "/exit" to end the demo.\n');
};

// Example demo scenarios
const demoScenarios = {
  customer: [
    "I need 2kg tomatoes",
    "Where can I find organic vegetables?",
    "I want to order fresh fruits for my family",
    "What vegetables are in season now?",
    "How do I know if the produce is fresh?",
    "Can you help me find a good farmer for organic produce?",
    "I want to talk to a farming expert about my garden"
  ],
  farmer: [
    "I want to sell 50kg tomatoes",
    "What is the current market price for onions?",
    "How do I list my produce on the platform?",
    "I need help with my crop disease",
    "When is the best time to harvest wheat?",
    "I want to connect with buyers for my organic vegetables",
    "What should I plant next season?"
  ]
};

// Function to print example queries
const showExamples = () => {
  console.log('\n' + colors.info('=== Example Queries for Current Role ==='));
  demoScenarios[currentUserRole].forEach((example, i) => {
    console.log(colors.info(`${i+1}. ${example}`));
  });
  console.log(colors.info('======================================\n'));
};

// Main chat function
const chat = async () => {
  printWelcome();
  showExamples();
  
  askQuestion();
  
  function askQuestion() {
    rl.question(colors.user('[YOU]: '), async (input) => {
      // Check for special commands
      if (input.toLowerCase() === '/exit') {
        printMessage('system', 'Ending demo. Goodbye!');
        rl.close();
        return;
      }
      
      if (input.toLowerCase() === '/switch') {
        switchRole();
        showExamples();
        askQuestion();
        return;
      }
      
      if (input.toLowerCase() === '/examples') {
        showExamples();
        askQuestion();
        return;
      }
      
      // Add user message to history
      conversationHistory.push({ role: 'user', content: input });
      
      try {
        console.log(colors.info('[AI is thinking...]'));
        
        // Get response from AI
        const userLocation = userLocations[currentUserRole];
        const aiResponse = await aiChatService.generateResponse(
          input,
          currentUserRole,
          conversationHistory,
          userLocation
        );
        
        // Add AI response to history
        conversationHistory.push({ role: 'assistant', content: aiResponse.message });
        
        // Display the response
        printMessage('assistant', aiResponse.message);
        
        // Show intent if available
        if (aiResponse.intent) {
          printMessage('info', `Detected Intent: ${aiResponse.intent}`);
        }
        
        // Show extracted data if available
        if (aiResponse.extractedData && Object.keys(aiResponse.extractedData).length > 0) {
          printMessage('info', 'Extracted Data:');
          console.log(colors.info(JSON.stringify(aiResponse.extractedData, null, 2)));
        }
        
        console.log('\n');
      } catch (error) {
        printMessage('error', `Error: ${error.message}`);
        console.error(error);
      }
      
      askQuestion();
    });
  }
};

// Start the chat
chat();