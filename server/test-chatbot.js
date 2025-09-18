import dotenv from 'dotenv';
import aiChatService from './services/aiChatService.js';

// Run a simple test of the chatbot
const testChatbot = async () => {
  try {
    console.log('Testing AI Chatbot...');
    console.log('Sending message: "I need 2kg tomatoes"');
    
    const response = await aiChatService.generateResponse(
      'I need 2kg tomatoes',
      'customer',
      [],
      null
    );
    
    console.log('\nResponse from AI:');
    console.log(JSON.stringify(response, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing chatbot:', error);
    process.exit(1);
  }
};

// Execute test
testChatbot();