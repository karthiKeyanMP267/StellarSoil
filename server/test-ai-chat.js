import dotenv from 'dotenv';
import aiChatService from './services/aiChatService.js';

// Load environment variables
dotenv.config();

const testAiChat = async () => {
  try {
    console.log('Testing AI Chat Service...');
    
    // Test the AI service
    const response = await aiChatService.generateResponse(
      'I need 2kg tomatoes',
      'customer',
      [],
      null
    );
    
    console.log('AI Response:');
    console.log(JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('Error testing AI Chat Service:', error);
  }
};

// Run the test
testAiChat();