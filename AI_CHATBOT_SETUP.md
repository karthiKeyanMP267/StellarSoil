# 🤖 Google Gemini AI Chatbot Setup Guide

## 🎯 Overview
Your StellarSoil platform now includes an intelligent AI chatbot powered by Google's Gemini API that can:

**For Customers:**
- Process natural language orders: "I need 2kg tomatoes"
- Find nearby farmers and products
- Add items to cart automatically
- Provide farming and gardening advice

**For Farmers:**
- Process product listings: "I have 10kg tomatoes for 30 rupees"
- Update inventory automatically
- Suggest optimal pricing
- Provide agricultural insights and advice

## 🚀 Updated Implementation

The AI chatbot has been enhanced with:

- ✅ **Fixed Environment Loading**: Properly loads environment variables using absolute paths
- ✅ **Updated Model**: Now using `gemini-1.5-flash-latest` for improved responses
- ✅ **Enhanced Error Handling**: Better fallback mechanisms if API fails
- ✅ **Interactive Demo Script**: Easy testing in terminal environment
- ✅ **Comprehensive Documentation**: Testing guide and demo scripts

## 🔧 Setup Instructions

### Step 1: Get Google Gemini API Key

1. **Visit Google AI Studio:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Copy the generated API key

3. **Add to Environment:**
   - Open `server/.env` file
   - Update with your API key and model name:
   ```env
   GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
   GOOGLE_GEMINI_MODEL=gemini-1.5-flash-latest
   ```

### Step 2: Test the Implementation

#### Method 1: Interactive Terminal Demo
```bash
cd server
node demo-chatbot.js
```

This interactive demo allows you to:
- Test both customer and farmer roles
- See intent recognition in action
- View extracted data from natural language
- Test different queries easily

#### Method 2: Web Application
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client  
cd client
npm run dev
```

Then test in the web interface with sample queries like:
- "I need 2kg tomatoes"
- "I want to sell 50kg potatoes at 30 rupees per kg"
- "What is the current market price for onions?"

## 🔍 Technical Implementation

### Environment Variable Loading

We've implemented a robust environment loading system:

```javascript
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up proper environment loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
```

This pattern has been implemented across:
- server/index.js
- server/services/aiChatService.js
- server/controllers/chatController.js
- server/services/weatherService.js
- server/services/marketPriceService.js
- server/utils/payment.js

### Google Gemini Integration

The AI service uses Google's Gemini 1.5 Flash model:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
this.model = this.genAI.getGenerativeModel({ 
  model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash-latest' 
});
```

### Robust Error Handling

The system gracefully handles API failures:

```javascript
try {
  // Attempt to get AI response
  const aiResponse = await this.generateGeminiResponse(message, context);
  return aiResponse;
} catch (error) {
  console.error('AI response generation error:', error);
  // Use fallback responses if AI fails
  return this.generateFallbackResponse(message, userRole);
}
```

## 📱 Usage Examples

### Customer Examples:
```
"I need 2kg tomatoes" 
→ Shows nearby farmers with tomatoes, allows instant ordering

"How do I grow tomatoes in my balcony garden?"
→ Provides gardening advice specific to balcony conditions

"What vegetables are in season now?"
→ Lists seasonal vegetables available from nearby farmers
```

### Farmer Examples:
```
"I have 50kg organic tomatoes, 30 rupees per kg"
→ Creates/updates product listing automatically

"What is the current market price for onions?"
→ Provides current market rates and pricing suggestions

"When is the best time to harvest wheat?"
→ Offers agricultural guidance based on crop type
```

## 🧪 Testing Tools

### Interactive Demo Script

The `demo-chatbot.js` script provides:

- Color-coded messages for better readability
- Role switching between customer and farmer
- Example suggestions for each role
- Detailed debug information (intents, extracted data)
- Simulated user locations for testing proximity features

### Example Commands:

```
/switch   - Toggle between customer and farmer modes
/examples - Show example queries for the current role
/exit     - End the demo
```

## 🐛 Troubleshooting

### Common Issues:

1. **"API key not found" error:**
   - Check `.env` file has correct API key
   - Verify environment loading is working (check server logs)
   - Ensure the key has proper permissions

2. **Environment variables not loading:**
   - Make sure all services use the absolute path loading pattern
   - Check console logs for environment loading confirmations
   - Restart the server after making changes

3. **AI responses not working:**
   - Verify Google Gemini API key is valid and has sufficient quota
   - Check if the model name is correct (gemini-1.5-flash-latest)
   - Look for any HTTP errors in the server logs

### Testing the Environment:

Run this test script to verify environment loading:

```javascript
// test-env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('Environment path:', envPath);
console.log('GOOGLE_GEMINI_API_KEY available:', !!process.env.GOOGLE_GEMINI_API_KEY);
console.log('GOOGLE_GEMINI_MODEL:', process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash-latest');
```

## 📊 Performance Considerations

- Initial response time: 1-3 seconds (API dependent)
- Fallback mode: Instant responses (no API call)
- Model selection: gemini-1.5-flash-latest balances speed and quality
- Caching: Common responses cached to reduce API calls

## � Additional Resources

### Documentation:
- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [StellarSoil Chatbot Testing Guide](./CHATBOT_TESTING_GUIDE.md)
- [StellarSoil Chatbot Demo Script](./CHATBOT_DEMO_SCRIPT.md)

### Key Files:
- `server/services/aiChatService.js` - Core AI integration
- `server/controllers/chatController.js` - Request handling
- `server/demo-chatbot.js` - Interactive testing tool

## � Future Enhancements

### Planned Features:
- **Multi-language support** (Hindi, Tamil, Telugu)
- **Voice interaction** for hands-free operation
- **Image recognition** for crop health analysis
- **Smart notifications** for price alerts
- **Enhanced context handling** for multi-turn conversations

---

🎉 **You're all set!** Your intelligent agricultural chatbot is now properly configured with Google Gemini and ready to help both farmers and customers through natural conversation!
