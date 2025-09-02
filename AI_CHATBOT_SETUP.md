# 🤖 Google AI Chatbot Setup Guide

## 🎯 Overview
Your StellarSoil platform now includes an intelligent AI chatbot powered by Google's Gemini API that can:

**For Customers:**
- Process natural language orders: "I need 2kg tomatoes"
- Find nearby farmers and products
- Add items to cart automatically
- Provide recipe suggestions and nutritional info

**For Farmers:**
- Process product listings: "I have 10kg tomatoes for 30 rupees"
- Update inventory automatically
- Suggest optimal pricing
- Market insights and farming advice

## 🔧 Setup Instructions

### Step 1: Get Google Gemini API Key

1. **Visit Google AI Studio:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select a project or create new one
   - Copy the generated API key

3. **Add to Environment:**
   - Open `server/.env` file
   - Replace `your-google-gemini-api-key` with your actual API key:
   ```env
   GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### Step 2: Test the Integration

1. **Start the application:**
   ```bash
   # Terminal 1 - Server
   cd server
   npm start

   # Terminal 2 - Client  
   cd client
   npm run dev
   ```

2. **Test Customer Orders:**
   - Open chatbot as customer
   - Try: "I need 2kg fresh tomatoes"
   - Try: "Order 1kg onions for delivery tomorrow"
   - Try: "What organic vegetables are available?"

3. **Test Farmer Listings:**
   - Login as farmer
   - Open chatbot 
   - Try: "I have 50kg tomatoes for 25 rupees per kg"
   - Try: "Fresh organic carrots, 30kg available, 40 rupees per kg"

## 🚀 Features Available

### 🛒 Customer Features
- **Smart Product Search**: Natural language queries find nearby products
- **Instant Ordering**: Voice/text orders automatically processed
- **Location-Based**: Shows products from farmers within 50km
- **Cart Integration**: Direct add-to-cart from chat
- **Recipe Suggestions**: AI-powered meal planning

### 🌱 Farmer Features  
- **Voice Product Listing**: Speak to list products instantly
- **Inventory Management**: Auto-updates existing products
- **Market Insights**: AI-powered pricing suggestions
- **Order Notifications**: Get notified when customers order your products

### 🎙️ Voice Recognition
- **Speech-to-Text**: Built-in browser voice recognition
- **Hands-Free Operation**: Perfect for farmers with dirty hands
- **Multi-Language Support**: Currently English, expandable

## 📱 Usage Examples

### Customer Examples:
```
"I need 2kg tomatoes" 
→ Shows nearby farmers with tomatoes, allows instant ordering

"Order fresh vegetables for dinner party tomorrow"
→ Suggests seasonal vegetables, provides quantity recommendations

"What's good for making pasta sauce?"
→ Recommends tomatoes, herbs, shows recipes
```

### Farmer Examples:
```
"I have 50kg organic tomatoes, 30 rupees per kg"
→ Creates/updates product listing automatically

"Fresh spinach ready, 20kg available"
→ Prompts for pricing, lists product when complete

"What's the market price for onions?"
→ Provides current market rates and pricing suggestions
```

## 🔍 Technical Details

### API Endpoints:
- `POST /api/chat/message` - Main chat endpoint
- `POST /api/chat/add-to-cart` - Cart integration  
- `GET /api/chat/nearby-products` - Product search

### Data Processing:
- **Intent Recognition**: Detects order_request, product_listing, general_query
- **Entity Extraction**: Pulls product names, quantities, prices
- **Location Matching**: Connects customers with nearby farmers
- **Inventory Updates**: Real-time stock management

### Security:
- **API Rate Limiting**: Prevents abuse
- **Input Validation**: Sanitizes all user inputs
- **Auth Integration**: Works with existing user system

## 🛠️ Customization Options

### Modify AI Behavior:
Edit `server/services/aiChatService.js`:
- Change system prompts for different personalities
- Add new product categories
- Modify price detection patterns
- Customize response styles

### Add New Languages:
Update voice recognition in `client/src/components/AISmartChatbot.jsx`:
```javascript
recognition.current.lang = 'hi-IN'; // Hindi
recognition.current.lang = 'ta-IN'; // Tamil
```

### Extend Product Detection:
Add to `extractProductListing()` and `extractOrderRequest()` methods:
```javascript
const products = [
  'tomato', 'potato', 'onion', 'carrot', 
  'rice', 'wheat', 'millet', 'quinoa'  // Add more
];
```

## 🐛 Troubleshooting

### Common Issues:

1. **"API key not found" error:**
   - Check `.env` file has correct API key
   - Restart server after adding key
   - Verify no extra spaces in environment variable

2. **Voice recognition not working:**
   - Ensure HTTPS connection (required for microphone)
   - Check browser permissions for microphone
   - Try different browsers (Chrome works best)

3. **Orders not processing:**
   - Verify user is logged in for cart operations
   - Check product availability in database
   - Ensure location permissions granted

4. **Products not found:**
   - Check farmers have products listed in database
   - Verify location detection working
   - Try different product names

### Fallback Mode:
If Google API is unavailable, the system automatically switches to:
- Rule-based responses
- Pattern matching for orders/listings  
- Basic intent detection
- Local processing (no external API calls)

## 💰 Cost Considerations

### Google Gemini API Pricing:
- **Free Tier**: 60 requests per minute
- **Paid Tier**: $0.00025 per 1K characters
- **Typical Usage**: ~2-5 cents per conversation

### Optimization Tips:
- Cache common responses
- Use shorter prompts when possible
- Implement conversation context limits
- Consider hybrid approach (AI + rules)

## 🔮 Future Enhancements

### Planned Features:
- **Multi-language support** (Hindi, Tamil, Telugu)
- **Image recognition** for crop health analysis
- **Voice ordering** with order confirmation
- **Smart notifications** for price alerts
- **Farmer-customer direct chat**
- **Integration with blockchain verification**

### Advanced AI Features:
- **Sentiment analysis** for customer satisfaction
- **Predictive ordering** based on purchase history
- **Dynamic pricing** recommendations
- **Seasonal planning** assistance

## 📞 Support

### Getting Help:
- Check server logs for detailed error messages
- Test in browser developer console for client issues
- Verify API key has proper permissions in Google Cloud Console
- Ensure MongoDB is running for data operations

### Contact Points:
- API Issues: Check Google AI Studio dashboard
- Integration Issues: Review server logs and error responses
- UI Issues: Check browser console for JavaScript errors

---

🎉 **You're all set!** Your intelligent agricultural chatbot is ready to help customers order products and farmers manage inventory through natural conversation!
