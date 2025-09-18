# 🤖 StellarSoil AI Chatbot Testing Guide

## Overview
The StellarSoil AI chatbot is now fully operational with Google Gemini integration. This guide covers testing the chatbot using both the interactive demo and the web interface.

## 🌟 Features Implemented

### 1. **Google Gemini AI Integration**
- ✅ Real AI responses using Gemini 1.5 Flash model
- ✅ Agricultural domain expertise
- ✅ Context-aware conversations
- ✅ Fallback mode for testing without API key

### 2. **Confirmation Workflow**
- ✅ Customer orders require confirmation before adding to cart
- ✅ Farmer listings require confirmation before creating products
- ✅ Clear Yes/No buttons for approval
- ✅ Success messages after processing

### 3. **Smart Intent Recognition**
- ✅ Automatically detects order requests
- ✅ Recognizes product listing attempts
- ✅ Extracts quantities, prices, and product names

## 🧪 Testing Methods

### Method 1: Interactive Terminal Demo

Run the demo script to test the chatbot in your terminal:

```bash
cd server
node demo-chatbot.js
```

**Demo Commands:**
- `/switch` - Toggle between customer and farmer modes
- `/examples` - Show example queries for the current role
- `/exit` - End the demo

### Method 2: Web Interface

Test the full integration in the web application:

```bash
# Start the server
cd server
npm start

# In a separate terminal, start the client
cd client
npm run dev
```

## 🔍 Testing Scenarios

### **For Customers (User Role)**

#### Test 1: Basic Order Request
1. **Say or Type:** "I need 2kg tomatoes"
2. **Expected:** Bot asks for confirmation with Yes/No buttons
3. **Action:** Click "Yes, add to cart"
4. **Result:** Product added to cart with success message

#### Test 2: Specific Order with Location
1. **Say or Type:** "I want 1kg organic potatoes near me"
2. **Expected:** Bot shows available products + confirmation
3. **Action:** Click "Yes, add to cart"
4. **Result:** Order processed

#### Test 3: Order Cancellation
1. **Type:** "I need 5kg carrots"
2. **Expected:** Confirmation prompt
3. **Action:** Click "No, show other options"
4. **Result:** Order cancelled, no cart update

#### Test 4: Agricultural Advice
1. **Type:** "How do I grow tomatoes in my balcony?"
2. **Expected:** Bot provides helpful gardening advice
3. **Result:** Informational response (no confirmation needed)

### **For Farmers (Farmer Role)**

#### Test 1: Product Listing
1. **Say or Type:** "I want to sell 10kg tomatoes at 25 rupees per kg"
2. **Expected:** Bot asks for listing confirmation
3. **Action:** Click "Yes, list it"
4. **Result:** Product listed successfully

#### Test 2: Organic Product Listing
1. **Type:** "I have 2kg organic spinach to sell at 40 rupees per kg"
2. **Expected:** Bot recognizes organic keyword + confirmation
3. **Action:** Click "Yes, list it"
4. **Result:** Organic product created

#### Test 3: Market Price Check
1. **Type:** "What is the current market price for onions?"
2. **Expected:** Bot provides current price information
3. **Result:** Informational response (no confirmation needed)

#### Test 4: Farming Advice
1. **Type:** "When is the best time to harvest wheat?"
2. **Expected:** Bot provides agricultural guidance
3. **Result:** Informational response (no confirmation needed)

## 🔧 Running the New Demo Script

The new demo script provides a comprehensive way to test the chatbot:

```bash
cd server
node demo-chatbot.js
```

**Features of the Demo Script:**
- Color-coded messages for better readability
- Role switching between customer and farmer
- Example suggestions for each role
- Detailed debug information (intents, extracted data)
- Simulated user locations for testing proximity features

## 🚀 Environment Setup

### Required Environment Variables

```
GOOGLE_GEMINI_API_KEY=your-api-key-here
GOOGLE_GEMINI_MODEL=gemini-1.5-flash-latest
```

### Troubleshooting Environment Issues

If the chatbot isn't working correctly:

1. Check that `.env` file is properly loaded using our absolute path method
2. Verify your API key is valid and has sufficient quota
3. Ensure the model name is correct (now using gemini-1.5-flash-latest)
4. Test with the demo script to isolate client/server issues

## 🐛 Common Issues & Solutions

### Issue: Chatbot gives default responses
**Solution:** 
- Verify Google Gemini API key is set in `.env`
- Check server logs for any API errors
- Ensure API key has proper permissions and quota

### Issue: Environment variables not loading
**Solution:**
- We've updated all services to use absolute path loading
- The format is now:
```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
```

### Issue: Orders/listings not processing
**Solution:**
- Check MongoDB connection is working
- Verify user authentication
- Test the relevant API endpoints directly

## 📊 Expected Performance

- Initial response time: 1-3 seconds
- Complex queries may take 3-5 seconds
- Google Gemini handles most agricultural queries effectively
- Fallback responses used if API unavailable

## 🌐 API Endpoint Testing

Test the API endpoint directly:

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "I need 2kg tomatoes",
    "userRole": "customer",
    "conversationHistory": [],
    "userLocation": {
      "type": "Point",
      "coordinates": [77.2090, 28.6139]
    }
  }'
```

## 📱 Testing on Mobile

The chatbot is responsive and works on mobile devices:
- Touch-friendly confirmation buttons
- Optimized chat interface
- Location-aware functionality

## 🎉 Ready for Production!

Your enhanced AI chatbot is now ready with:
- ✅ Google Gemini AI integration with proper environment loading
- ✅ Interactive demo script for easy testing
- ✅ Confirmation workflow for orders and listings
- ✅ Agricultural domain expertise
- ✅ Consistent environment variable loading across all services
