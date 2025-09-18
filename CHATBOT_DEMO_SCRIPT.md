# 🎬 StellarSoil AI Chatbot Demo Script

## Preparation

Before starting the demo, ensure you have:

1. The server running with all environment variables properly set:
   ```bash
   cd server
   npm start
   ```

2. For interactive terminal demo (optional):
   ```bash
   cd server
   node demo-chatbot.js
   ```

3. For web interface demo (main):
   ```bash
   cd client
   npm run dev
   ```

## Demo Introduction (1 minute)

"Today I'll demonstrate StellarSoil's AI chatbot powered by Google Gemini. This intelligent assistant helps both farmers and customers with agricultural commerce, providing real-time assistance for orders, listings, and farming advice."

**Key Points:**
- Powered by Google Gemini 1.5 Flash model
- Context-aware conversations
- Intent recognition for orders and listings 
- Confirmation workflow for safety

## Demo Method 1: Interactive Terminal (2 minutes)

"First, let's see the core AI functionality in our terminal demo:"

```bash
cd server
node demo-chatbot.js
```

**Show Terminal Features:**
- Switch between customer/farmer roles with `/switch`
- Show example queries with `/examples`
- Highlight color-coded messages
- Demonstrate intent detection and data extraction

**Terminal Demo Queries:**
1. Customer: "I need 2kg tomatoes"
2. Farmer: "I want to sell 50kg potatoes at 30 rupees per kg"
3. Switch to farmer mode and ask: "What is the current market price for onions?"

## Demo Method 2: Web Interface (5 minutes)

### Customer Demo

**Login as Customer:**
"Now, let's see the complete integration in our web application."

**Customer Query 1: Basic Order**
```
Customer: "I need some fresh vegetables for dinner"

AI: "Good evening! I'd be happy to help you find fresh produce for dinner. What specific vegetables are you thinking about? I can check what's available from local farmers near you."

Customer: "I need 2kg tomatoes and 1kg onions"

AI: [Shows available products with confirmation buttons]

Customer: [Click "Yes, add to cart"]

AI: [Shows success message with cart information]
```

**Highlight Features:**
- Intent recognition (order request)
- Product extraction (tomatoes, onions)
- Quantity extraction (2kg, 1kg)
- Confirmation workflow
- Cart integration

### Farmer Demo

**Login as Farmer:**
"Let's switch to a farmer's perspective."

**Farmer Query 1: Product Listing**
```
Farmer: "I have fresh harvest ready"

AI: "Good morning! That's wonderful news about your fresh harvest! I'm excited to help you get it listed for customers. What did you harvest today?"

Farmer: "I have 50kg tomatoes for 30 rupees per kg"

AI: [Shows listing confirmation]

Farmer: [Click "Yes, list it"]

AI: [Shows success message with listing details]
```

**Highlight Features:**
- Intent recognition (product listing)
- Product/quantity/price extraction
- Listing confirmation workflow
- Integration with product database

**Farmer Query 2: Market Information**
```
Farmer: "What is the current market price for onions?"

AI: [Provides current market information and price trends]
```

## Technical Highlights (2 minutes)

"Let me highlight some technical aspects of our implementation:"

1. **Google Gemini Integration**: Show how we connect to the Gemini API
   ```javascript
   // Using the latest model
   this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
   ```

2. **Environment Variable Loading**: Demonstrate our robust environment loading
   ```javascript
   // Proper environment loading with absolute paths
   const __dirname = path.dirname(fileURLToPath(import.meta.url));
   const envPath = path.resolve(__dirname, '../.env');
   dotenv.config({ path: envPath });
   ```

3. **Intent Recognition**: Show how we detect user intents
   ```javascript
   // Example extracted from chat
   {
     "intent": "order_request",
     "extractedData": {
       "productName": "tomatoes",
       "quantity": 2,
       "unit": "kg"
     }
   }
   ```

4. **Confirmation Workflow**: Show the two-step process for safety
   ```javascript
   // Confirmation data structure
   additionalData.pendingConfirmation = {
     type: 'order',
     productId: bestMatch.id,
     productName: bestMatch.name,
     quantity: aiResponse.extractedData.quantity || 1,
     unit: aiResponse.extractedData.unit || 'kg',
     price: bestMatch.price,
     totalCost: bestMatch.price * (aiResponse.extractedData.quantity || 1)
   };
   ```

## Demo Scenario: Advanced Features (2 minutes)

**Customer Query: Agricultural Advice**
```
Customer: "How do I grow tomatoes in my balcony garden?"

AI: [Provides detailed gardening advice specific to balcony conditions]
```

**Farmer Query: Crop Planning**
```
Farmer: "When is the best time to plant wheat in northern India?"

AI: [Provides region-specific agricultural advice with seasonal recommendations]
```

## Fallback Handling (1 minute)

"Our system gracefully handles situations when the AI service is unavailable:"

```javascript
// Fallback system ensures responses even without API
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

## Closing (1 minute)

"This AI chatbot significantly improves the user experience for both farmers and customers by:

1. Reducing friction in the buying/selling process
2. Providing agricultural expertise on demand
3. Making complex interactions conversational
4. Ensuring safety with confirmation workflows
5. Creating a consistent experience across devices

With our enhanced environment variable loading system, the chatbot now works reliably across all services, with proper integration of the Google Gemini API."

## Q&A (2 minutes)

"I'd be happy to answer any questions about the implementation or demonstrate additional features."

---

## Appendix: Additional Demo Scenarios

### Error Handling Demo
```
Customer: "I want vegetables"

AI: [Asks for clarification about specific vegetables]

Customer: "Something for curry"

AI: [Provides suggestions for curry ingredients]
```

### Voice Recognition Demo (If Available)
```
[User clicks microphone button]

User: *speaks* "I need 2kg tomatoes"

AI: [Processes voice input and responds accordingly]
```

### Location-Aware Demo
```
Customer: "Find farmers near me"

AI: [Uses location data to recommend nearby farmers]
```
