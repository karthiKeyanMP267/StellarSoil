#!/usr/bin/env node

/**
 * 🚀 AI Chatbot Demo Script - Confirmation Workflow
 * 
 * This script demonstrates the enhanced chatbot features
 * Run with: node demo-chatbot.js
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function separator() {
  console.log(colors.cyan + '━'.repeat(60) + colors.reset);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateChat(userType, message, response, hasConfirmation = false) {
  log(colors.blue, `\n👤 ${userType}: "${message}"`);
  await sleep(1000);
  
  log(colors.green, `🤖 Bot: ${response}`);
  await sleep(1500);
  
  if (hasConfirmation) {
    log(colors.yellow, '📋 Confirmation Required:');
    log(colors.cyan, '   [Yes, confirm]  [No, cancel]');
    await sleep(2000);
    
    log(colors.green, '👤 User clicks: "Yes, confirm"');
    await sleep(1000);
    
    if (userType.includes('Customer')) {
      log(colors.green, '✅ Order added to cart successfully! 🛒');
    } else {
      log(colors.green, '✅ Product listed successfully! 📝');
    }
  }
}

async function runDemo() {
  console.clear();
  
  log(colors.bright + colors.magenta, '🌟 STELLARSOIL AI CHATBOT DEMO 🌟');
  log(colors.bright, 'Enhanced with Google AI & Confirmation Workflow');
  separator();
  
  log(colors.cyan, '🎯 Demo Features:');
  console.log('  • Google Gemini AI Integration');
  console.log('  • Confirmation Workflow for Orders & Listings');
  console.log('  • Voice Recognition Support');
  console.log('  • Agricultural Domain Expertise');
  console.log('  • Context-Aware Conversations\n');
  
  await sleep(2000);
  
  // Customer Demo
  log(colors.bright + colors.blue, '📱 CUSTOMER DEMO - Order Processing');
  separator();
  
  await simulateChat(
    'Customer',
    'I need 2kg tomatoes',
    'I found fresh tomatoes available near you! Would you like me to add 2kg tomatoes to your cart for ₹40?',
    true
  );
  
  await sleep(2000);
  
  await simulateChat(
    'Customer',
    'I want organic potatoes 1kg',
    'Great choice! I found organic potatoes from Green Farm (2km away). Shall I add 1kg organic potatoes to your cart for ₹60?',
    true
  );
  
  await sleep(3000);
  
  // Farmer Demo
  log(colors.bright + colors.green, '\n🌾 FARMER DEMO - Product Listing');
  separator();
  
  await simulateChat(
    'Farmer',
    '1kg tomato 25 rupees',
    'Perfect! I understand you want to list tomatoes. Let me confirm: List 1kg fresh tomatoes at ₹25 per kg?',
    true
  );
  
  await sleep(2000);
  
  await simulateChat(
    'Farmer',
    '3kg organic spinach 40 rupees per kg',
    'Excellent! Organic produce is in high demand. Confirm listing: 3kg organic spinach at ₹40 per kg?',
    true
  );
  
  await sleep(3000);
  
  // Voice Demo
  log(colors.bright + colors.magenta, '\n🎤 VOICE RECOGNITION DEMO');
  separator();
  
  log(colors.blue, '👤 Customer clicks microphone button 🎤');
  await sleep(1000);
  log(colors.yellow, '🎙️  Listening... "I need fresh onions 3 kilograms"');
  await sleep(2000);
  log(colors.cyan, '📝 Voice converted to text: "I need fresh onions 3 kilograms"');
  await sleep(1000);
  
  await simulateChat(
    'Voice Customer',
    'I need fresh onions 3 kilograms',
    'Voice order received! I found fresh onions available. Confirm adding 3kg onions to your cart for ₹90?',
    true
  );
  
  await sleep(3000);
  
  // Safety Demo
  log(colors.bright + colors.red, '\n🛡️  SAFETY DEMO - Order Cancellation');
  separator();
  
  await simulateChat(
    'Customer',
    'I need 10kg expensive mangoes',
    'I found premium mangoes available. This will cost ₹500. Confirm adding 10kg mangoes to your cart?'
  );
  
  await sleep(1000);
  log(colors.yellow, '📋 Confirmation Required:');
  log(colors.cyan, '   [Yes, confirm]  [No, cancel]');
  await sleep(1500);
  
  log(colors.red, '👤 User clicks: "No, cancel"');
  await sleep(1000);
  log(colors.yellow, '❌ Order cancelled. No items added to cart.');
  
  await sleep(3000);
  
  // Technology Stack
  log(colors.bright + colors.cyan, '\n🔧 TECHNOLOGY STACK');
  separator();
  
  console.log('Backend:');
  console.log('  • Google Gemini AI API');
  console.log('  • Node.js + Express');
  console.log('  • MongoDB Integration');
  console.log('  • JWT Authentication');
  console.log('');
  console.log('Frontend:');
  console.log('  • React + Vite');
  console.log('  • Framer Motion Animations');
  console.log('  • Web Speech API');
  console.log('  • Tailwind CSS');
  console.log('');
  console.log('Features:');
  console.log('  • Intent Recognition');
  console.log('  • Entity Extraction');
  console.log('  • Confirmation Workflow');
  console.log('  • Voice Recognition');
  console.log('  • Context Management');
  
  await sleep(3000);
  
  log(colors.bright + colors.green, '\n🎉 DEMO COMPLETE!');
  separator();
  
  log(colors.cyan, '🚀 Your AI chatbot is ready with:');
  console.log('  ✅ Real Google AI responses');
  console.log('  ✅ Confirmation safety measures');
  console.log('  ✅ Voice recognition support');
  console.log('  ✅ Agricultural domain expertise');
  console.log('  ✅ Mobile-friendly interface');
  
  log(colors.bright + colors.magenta, '\n🌐 Test it live at: http://localhost:5173/');
  log(colors.yellow, '📖 Full guide: CHATBOT_TESTING_GUIDE.md');
  
  console.log('\n');
}

// Run the demo
runDemo().catch(console.error);
