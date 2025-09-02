# 🤖 AI Chatbot Testing Guide - Confirmation Workflow

## Overview
The AI chatbot now includes a confirmation workflow that requires user approval before processing orders or listings. This guide demonstrates the enhanced features.

## 🌟 Features Implemented

### 1. **Google Gemini AI Integration**
- Real AI responses (when API key is configured)
- Agricultural domain expertise
- Context-aware conversations
- Fallback mode for testing without API key

### 2. **Confirmation Workflow**
- ✅ Customer orders require confirmation before adding to cart
- ✅ Farmer listings require confirmation before creating products
- ✅ Clear Yes/No buttons for approval
- ✅ Success messages after processing

### 3. **Voice Recognition**
- 🎤 Hands-free operation
- Voice-to-text conversion
- Click microphone button to start listening

### 4. **Smart Intent Recognition**
- Automatically detects order requests
- Recognizes product listing attempts
- Extracts quantities, prices, and product names

## 🧪 Testing Scenarios

### **For Customers (User Role)**

#### Test 1: Basic Order Request
1. **Say or Type:** "I need 2kg tomatoes"
2. **Expected:** Bot asks for confirmation with Yes/No buttons
3. **Action:** Click "Yes, confirm"
4. **Result:** Product added to cart with success message

#### Test 2: Specific Order with Location
1. **Say or Type:** "I want 1kg organic potatoes near me"
2. **Expected:** Bot shows available products + confirmation
3. **Action:** Click "Yes, confirm"
4. **Result:** Order processed

#### Test 3: Voice Order
1. **Click:** Microphone button (🎤)
2. **Speak:** "I need fresh onions 3 kilograms"
3. **Wait:** For voice recognition to convert
4. **Expected:** Confirmation prompt appears
5. **Action:** Click "Yes, confirm"

#### Test 4: Order Cancellation
1. **Type:** "I need 5kg carrots"
2. **Expected:** Confirmation prompt
3. **Action:** Click "No, cancel"
4. **Result:** Order cancelled, no cart update

### **For Farmers (Farmer Role)**

#### Test 1: Product Listing
1. **Say or Type:** "1kg tomato 25 rupees"
2. **Expected:** Bot asks for listing confirmation
3. **Action:** Click "Yes, confirm"
4. **Result:** Product listed successfully

#### Test 2: Organic Product Listing
1. **Type:** "2kg organic spinach 40 rupees per kg"
2. **Expected:** Bot recognizes organic keyword + confirmation
3. **Action:** Click "Yes, confirm"
4. **Result:** Organic product created

#### Test 3: Voice Listing
1. **Click:** Microphone button
2. **Speak:** "Fresh cauliflower 3 kilograms 30 rupees per kg"
3. **Expected:** Voice converted + confirmation prompt
4. **Action:** Click "Yes, confirm"

#### Test 4: Listing Cancellation
1. **Type:** "5kg beans 20 rupees"
2. **Expected:** Confirmation prompt
3. **Action:** Click "No, cancel"
4. **Result:** Listing cancelled

## 🔧 Technical Details

### **API Endpoints**
- `POST /api/chat/message` - Main chat endpoint
- Handles confirmation workflow
- Processes orders and listings after approval

### **Frontend State Management**
- `pendingConfirmation` - Stores confirmation data
- `requiresConfirmation` - Triggers confirmation UI
- `orderProcessed/listingProcessed` - Shows success states

### **Backend Processing**
- Intent recognition extracts user intentions
- Entity extraction gets products, quantities, prices
- Confirmation workflow prevents accidental actions
- Integration with cart and product management

## 🚀 Setup for Production

### 1. **Get Google Gemini API Key**
```bash
# Visit: https://makersuite.google.com/app/apikey
# Get your API key and update .env file:
GOOGLE_GEMINI_API_KEY=your-actual-api-key-here
```

### 2. **Environment Configuration**
```bash
# In server/.env
GOOGLE_GEMINI_API_KEY=your-actual-api-key
```

### 3. **Restart Server**
```bash
cd server
npm start
# Should show: "Google Gemini API initialized successfully"
```

## 🎯 Key Benefits

1. **Safety First**: Confirmation prevents accidental orders/listings
2. **Real AI**: Google Gemini provides intelligent responses
3. **Voice-Enabled**: Hands-free operation for busy farmers
4. **Context-Aware**: Remembers conversation history
5. **Domain-Specific**: Tailored for agricultural needs

## 🐛 Troubleshooting

### Issue: "Using fallback responses"
**Solution:** Add real Google Gemini API key to `.env` file

### Issue: Voice recognition not working
**Solution:** Ensure browser permissions for microphone access

### Issue: Confirmation buttons not appearing
**Solution:** Check that message has `requiresConfirmation: true`

### Issue: Orders not processing
**Solution:** Verify user authentication and cart API endpoints

## 📱 Mobile Testing

The chatbot is fully responsive and works on mobile devices:
- Touch-friendly confirmation buttons
- Mobile voice recognition support
- Optimized chat interface

## 🎉 Demo Ready!

Your enhanced AI chatbot is now ready with:
- ✅ Google AI integration
- ✅ Confirmation workflow
- ✅ Voice recognition
- ✅ Agricultural domain expertise
- ✅ Safety measures

Test it live at: http://localhost:5173/
