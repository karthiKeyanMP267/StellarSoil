import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Use absolute path for .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log(`Loading .env file from: ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.error(`ERROR: .env file not found at: ${envPath}`);
}

// Log the API key (first few characters)
if (process.env.GOOGLE_GEMINI_API_KEY) {
  console.log(`API key found: ${process.env.GOOGLE_GEMINI_API_KEY.substring(0, 10)}...`);
} else {
  console.error('API key not found in environment variables');
}

class AIChatService {
  constructor() {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found. Using fallback responses.');
      this.genAI = null;
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      console.log('Google Gemini API initialized successfully with model: gemini-1.5-flash-latest');
    } catch (error) {
      console.error('Failed to initialize Google Gemini API:', error);
      this.genAI = null;
    }
  }

  // The rest of the code remains the same as the original file
  
  // For testing purposes, let's add a simple method
  async testGeneration() {
    if (!this.genAI) {
      return { success: false, message: 'API not initialized' };
    }
    
    try {
      const result = await this.model.generateContent('Say hello');
      const response = await result.response;
      const text = response.text();
      return { success: true, message: text };
    } catch (error) {
      console.error('Test generation error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // All other methods from the original file...
  getSystemPrompt(userRole, userLocation = null) {
    // Same as original
    const basePrompt = `You are an AI assistant for StellarSoil, an agricultural marketplace platform. 

CRITICAL INSTRUCTIONS:
- You MUST respond in JSON format with the following structure:
{
  "message": "your response text",
  "intent": "detected intent (order_request, product_listing, general_query, order_confirmation, listing_confirmation, etc.)",
  "extractedData": {
    // any structured data extracted from user message
  },
  "actions": ["suggested action buttons"],
  "needsLocation": boolean,
  "requiresConfirmation": boolean,
  "confirmationData": {
    // data for pending confirmation
  }
}

PLATFORM CONTEXT:
- StellarSoil connects farmers with customers for fresh produce
- Customers can order fresh vegetables, fruits, and farm products
- Farmers can list their products with prices and quantities
- Orders are processed based on user location and farmer proximity

USER ROLE: ${userRole}
${userLocation ? `USER LOCATION: ${userLocation}` : 'USER LOCATION: Unknown (may need to request)'}`;

    if (userRole === 'farmer') {
      return basePrompt + `

FARMER-SPECIFIC INSTRUCTIONS:
- Help farmers list their products (vegetables, fruits, grains, etc.)
- Extract product details: name, quantity, price, quality grade
- ALWAYS ask for confirmation before listing products
- Show extracted details and ask for approval before saving
- Suggest optimal pricing based on market trends
- Provide farming advice when asked
- Help with inventory management

PRODUCT LISTING FORMAT:
When a farmer wants to list products, extract:
- Product name (standardized: tomato, potato, onion, etc.)
- Quantity (in kg, liters, pieces)
- Price per unit (in rupees)
- Quality grade (premium, standard, organic)
- Availability period

CONFIRMATION WORKFLOW:
1. First detect listing intent and extract product details
2. Ask: "I understand you want to list [quantity] [product] at ₹[price] per [unit]. Should I add this to your inventory?"
3. Wait for user approval (yes/confirm/list it) before actually creating the listing
4. Only after confirmation, create the product listing

EXAMPLES:
User: "I have 50kg tomatoes for 25 rupees per kg"
Response: Extract details, ask "I understand you want to list 50kg tomatoes at ₹25 per kg. Should I add this to your inventory?"

User: "Yes, list it" / "Confirm" / "Yes please"
Response: Extract as listing_confirmation, create the product listing`;

    } else {
      return basePrompt + `

CUSTOMER-SPECIFIC INSTRUCTIONS:
- Help customers find and order fresh produce
- Extract order details: product name, quantity needed
- ALWAYS ask for confirmation before processing orders
- Show available products but require approval to add to cart
- Provide nutritional information and recipe suggestions
- Handle order modifications and tracking

ORDER PROCESSING FORMAT:
When a customer wants to order, extract:
- Product name (standardized)
- Quantity needed (in kg, pieces, etc.)
- Delivery preferences
- Budget constraints if mentioned

CONFIRMATION WORKFLOW:
1. First detect order intent and show available products
2. Ask: "Would you like me to add [quantity] [product] from [farmer] to your cart for ₹[price]?"
3. Wait for user approval (yes/confirm/add) before actually processing
4. Only after confirmation, add to cart and show success message

EXAMPLES:
User: "I need 2kg tomatoes"
Response: Show available tomatoes, ask "Would you like me to add 2kg tomatoes from [best farmer] to your cart for ₹[price]?"

User: "Yes, add to cart" / "Confirm order" / "Yes please"
Response: Extract as order_confirmation, process the order`;
    }
  }

  async generateResponse(userMessage, userRole, conversationHistory = [], userLocation = null) {
    try {
      if (!this.genAI) {
        return this.getFallbackResponse(userMessage, userRole);
      }

      const systemPrompt = this.getSystemPrompt(userRole, userLocation);
      
      // Build conversation context
      let conversationContext = '';
      if (conversationHistory.length > 0) {
        conversationContext = '\n\nRECENT CONVERSATION:\n' + 
          conversationHistory.slice(-5).map(msg => 
            `${msg.sender}: ${msg.text}`
          ).join('\n');
      }

      const fullPrompt = `${systemPrompt}${conversationContext}

USER MESSAGE: "${userMessage}"

Remember to respond ONLY in the specified JSON format. Be helpful, friendly, and focused on agricultural commerce.`;

      console.log('Sending prompt to Gemini API...');
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      console.log('Received response from Gemini API');

      // Try to parse JSON response
      try {
        const jsonResponse = JSON.parse(text);
        return this.validateAndCleanResponse(jsonResponse, userRole);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        // Extract message from non-JSON response
        return {
          message: text.replace(/```json|```/g, '').trim(),
          intent: 'general_query',
          extractedData: {},
          actions: ['Ask another question', 'Get help'],
          needsLocation: false
        };
      }

    } catch (error) {
      console.error('AI Chat Service Error:', error);
      return this.getFallbackResponse(userMessage, userRole);
    }
  }

  validateAndCleanResponse(response, userRole) {
    // Ensure required fields exist
    const cleanResponse = {
      message: response.message || 'I understand your request. How can I help you further?',
      intent: response.intent || 'general_query',
      extractedData: response.extractedData || {},
      actions: Array.isArray(response.actions) ? response.actions.slice(0, 4) : [],
      needsLocation: Boolean(response.needsLocation),
      requiresConfirmation: Boolean(response.requiresConfirmation),
      confirmationData: response.confirmationData || {}
    };

    // Add role-specific default actions if none provided
    if (cleanResponse.actions.length === 0) {
      if (userRole === 'farmer') {
        cleanResponse.actions = ['List products', 'Check inventory', 'Market prices', 'Farming tips'];
      } else {
        cleanResponse.actions = ['Browse products', 'Track order', 'Recipe ideas', 'Seasonal picks'];
      }
    }

    return cleanResponse;
  }

  getFallbackResponse(userMessage, userRole) {
    const message = userMessage.toLowerCase();
    
    // Simple intent detection for fallback
    let intent = 'general_query';
    let extractedData = {};
    let needsLocation = false;
    let requiresConfirmation = false;
    let confirmationData = {};

    // Check for confirmation responses
    if (message.includes('yes') || message.includes('confirm') || message.includes('add to cart') || 
        message.includes('list it') || message.includes('proceed') || message.includes('approve')) {
      if (userRole === 'farmer') {
        intent = 'listing_confirmation';
      } else {
        intent = 'order_confirmation';
      }
    }
    // Check for order/listing intents
    else if (userRole === 'farmer') {
      if (message.includes('kg') && (message.includes('rupee') || message.includes('rs') || message.includes('₹'))) {
        intent = 'product_listing';
        extractedData = this.extractProductListing(userMessage);
        requiresConfirmation = true;
        confirmationData = extractedData;
      }
    } else {
      if (message.includes('need') || message.includes('want') || message.includes('order')) {
        intent = 'order_request';
        extractedData = this.extractOrderRequest(userMessage);
        needsLocation = true;
        requiresConfirmation = true;
        confirmationData = extractedData;
      }
    }

    const responses = {
      farmer: {
        product_listing: "I understand you want to list that product. Let me confirm the details before adding it to your inventory.",
        listing_confirmation: "Perfect! I'll process your product listing now.",
        general_query: "Hello! I'm here to help you manage your farm products and connect with customers. What would you like to do today?"
      },
      customer: {
        order_request: "I'd be happy to help you find that product! Let me show you what's available and confirm your order.",
        order_confirmation: "Excellent! I'll add that to your cart right now.",
        general_query: "Welcome! I can help you find fresh produce, place orders, and discover amazing recipes. What are you looking for today?"
      }
    };

    return {
      message: responses[userRole][intent] || responses[userRole].general_query,
      intent,
      extractedData,
      actions: userRole === 'farmer' 
        ? ['List products', 'Check inventory', 'Market prices', 'Farming tips']
        : ['Browse products', 'Track order', 'Recipe ideas', 'Seasonal picks'],
      needsLocation,
      requiresConfirmation,
      confirmationData
    };
  }

  extractProductListing(message) {
    const data = {};
    
    // Extract quantity and unit
    const quantityMatch = message.match(/(\d+(?:\.\d+)?)\s*(kg|g|liters?|pieces?|dozen)/i);
    if (quantityMatch) {
      data.quantity = parseFloat(quantityMatch[1]);
      data.unit = quantityMatch[2].toLowerCase();
    }

    // Extract price
    const priceMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:rupees?|rs|₹)/i);
    if (priceMatch) {
      data.pricePerUnit = parseFloat(priceMatch[1]);
    }

    // Extract product name (basic detection)
    const products = ['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'cauliflower', 'spinach', 'lettuce'];
    for (const product of products) {
      if (message.toLowerCase().includes(product)) {
        data.productName = product;
        break;
      }
    }

    return data;
  }

  extractOrderRequest(message) {
    const data = {};
    
    // Extract quantity and unit
    const quantityMatch = message.match(/(\d+(?:\.\d+)?)\s*(kg|g|liters?|pieces?|dozen)/i);
    if (quantityMatch) {
      data.quantity = parseFloat(quantityMatch[1]);
      data.unit = quantityMatch[2].toLowerCase();
    }

    // Extract product name
    const products = ['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'cauliflower', 'spinach', 'lettuce'];
    for (const product of products) {
      if (message.toLowerCase().includes(product)) {
        data.productName = product;
        break;
      }
    }

    return data;
  }
}

// Export a singleton instance
const aiChatService = new AIChatService();
export default aiChatService;

// Add a simple test function
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const testService = async () => {
    console.log('Testing AI Chat Service directly...');
    const test = await aiChatService.testGeneration();
    console.log('Test result:', test);
    
    const response = await aiChatService.generateResponse('I need 2kg tomatoes', 'customer', []);
    console.log('Sample response:', JSON.stringify(response, null, 2));
    
    process.exit(0);
  };
  
  testService();
}