import aiChatService from '../services/aiChatService.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up proper environment loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

class ChatController {
  // Main chat endpoint
  async sendMessage(req, res) {
    try {
      const { message, userRole, conversationHistory, userLocation, pendingConfirmation } = req.body;
      const userId = req.user?.id;

      if (!message || !userRole) {
        return res.status(400).json({
          success: false,
          error: 'Message and user role are required'
        });
      }

      // Generate AI response
      const aiResponse = await aiChatService.generateResponse(
        message, 
        userRole, 
        conversationHistory || [],
        userLocation
      );

      // Process specific intents
      let additionalData = {};

      // Handle confirmation intents first
      if (aiResponse.intent === 'order_confirmation' && userId && pendingConfirmation) {
        additionalData = await this.processOrderConfirmation(pendingConfirmation, userId);
      } else if (aiResponse.intent === 'listing_confirmation' && userId && pendingConfirmation) {
        additionalData = await this.processListingConfirmation(pendingConfirmation, userId, userLocation);
      }
      // Handle initial requests that need confirmation
      else if (aiResponse.intent === 'order_request' && userId) {
        additionalData = await this.handleOrderRequest(aiResponse.extractedData, userId, userLocation);
        if (additionalData.availableProducts && additionalData.availableProducts.length > 0) {
          // Prepare confirmation data
          const bestMatch = additionalData.availableProducts[0];
          additionalData.pendingConfirmation = {
            type: 'order',
            productId: bestMatch.id,
            productName: bestMatch.name,
            quantity: aiResponse.extractedData.quantity || 1,
            unit: aiResponse.extractedData.unit || 'kg',
            price: bestMatch.price,
            farmerName: bestMatch.farmerName,
            totalCost: bestMatch.price * (aiResponse.extractedData.quantity || 1)
          };
          additionalData.requiresConfirmation = true;
          additionalData.message = `I found ${bestMatch.name} from ${bestMatch.farmerName} at ₹${bestMatch.price}/${bestMatch.unit}. 

Total cost: ₹${additionalData.pendingConfirmation.totalCost} for ${additionalData.pendingConfirmation.quantity}${additionalData.pendingConfirmation.unit}

Would you like me to add this to your cart?`;
          additionalData.actions = ['✅ Yes, add to cart', '❌ No, show other options', '🔍 Find different product'];
        }
      } else if (aiResponse.intent === 'product_listing' && userId) {
        const { productName, quantity, unit, pricePerUnit } = aiResponse.extractedData;
        if (productName && quantity && pricePerUnit) {
          // Prepare confirmation data
          additionalData.pendingConfirmation = {
            type: 'listing',
            productName: productName,
            quantity: quantity,
            unit: unit || 'kg',
            pricePerUnit: pricePerUnit,
            totalValue: quantity * pricePerUnit
          };
          additionalData.requiresConfirmation = true;
          additionalData.message = `I understand you want to list:

📦 Product: ${productName}
⚖️ Quantity: ${quantity}${unit || 'kg'}
💰 Price: ₹${pricePerUnit} per ${unit || 'kg'}
💵 Total Value: ₹${additionalData.pendingConfirmation.totalValue}

Should I add this to your inventory for customers to see?`;
          additionalData.actions = ['✅ Yes, list it', '❌ No, let me change details', '💡 Suggest better pricing'];
        }
      }

      res.json({
        success: true,
        data: {
          ...aiResponse,
          ...additionalData,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Chat Controller Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process chat message',
        message: 'I apologize, but I encountered an issue. Please try again.'
      });
    }
  }

  // Handle customer order requests
  async handleOrderRequest(extractedData, userId, userLocation) {
    try {
      const { productName, quantity, unit } = extractedData;

      if (!productName) {
        return {
          availableProducts: [],
          message: "I'd be happy to help you find products! Could you specify what you're looking for?"
        };
      }

      // Mock products for testing chatbot integration
      const mockProducts = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'tomato',
          price: 25,
          unit: 'kg',
          quantity: 100,
          farmer: { name: 'Sunny Farms' },
          isActive: true
        },
        {
          _id: '507f1f77bcf86cd799439012', 
          name: 'potato',
          price: 20,
          unit: 'kg',
          quantity: 50,
          farmer: { name: 'Green Valley Farm' },
          isActive: true
        },
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'onion', 
          price: 30,
          unit: 'kg',
          quantity: 75,
          farmer: { name: 'Hillside Farms' },
          isActive: true
        },
        {
          _id: '507f1f77bcf86cd799439014',
          name: 'carrot',
          price: 35,
          unit: 'kg', 
          quantity: 40,
          farmer: { name: 'Organic Gardens' },
          isActive: true
        }
      ];

      // Filter products that match the search
      const availableProducts = mockProducts.filter(product => 
        product.name.toLowerCase().includes(productName.toLowerCase()) &&
        product.quantity > 0 &&
        product.isActive
      );

      if (availableProducts.length === 0) {
        return {
          availableProducts: [],
          message: `I couldn't find ${productName} available nearby. Would you like me to check for similar products or notify you when it becomes available?`,
          actions: ['Find similar products', 'Set availability alert', 'Browse all products']
        };
      }

      // Find the best match based on price and distance
      const bestMatch = availableProducts[0];

      return {
        availableProducts: availableProducts.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          availableQuantity: product.quantity,
          farmerName: product.farmer.name,
          farmerLocation: product.farmer.location,
          distance: userLocation ? this.calculateDistance(userLocation, product.farmerLocation) : null,
          quality: product.quality || 'standard',
          organic: product.organic || false
        })),
        bestMatch: {
          id: bestMatch._id,
          canFulfill: bestMatch.quantity >= (quantity || 1),
          totalPrice: bestMatch.price * (quantity || 1),
          estimatedDelivery: this.getEstimatedDelivery(userLocation, bestMatch.farmerLocation)
        },
        orderData: {
          productId: bestMatch._id,
          requestedQuantity: quantity || 1,
          requestedUnit: unit || 'kg'
        }
      };

    } catch (error) {
      console.error('Order Request Error:', error);
      return {
        availableProducts: [],
        message: "I encountered an issue while searching for products. Please try again."
      };
    }
  }

  // Handle farmer product listings
  async handleProductListing(extractedData, userId, farmerLocation) {
    try {
      const { productName, quantity, unit, pricePerUnit } = extractedData;

      if (!productName || !quantity || !pricePerUnit) {
        return {
          listingStatus: 'incomplete',
          message: "I need a bit more information to list your product. Please provide the product name, quantity, and price per unit.",
          missingFields: {
            productName: !productName,
            quantity: !quantity,
            pricePerUnit: !pricePerUnit
          }
        };
      }

      // Check if farmer already has this product listed
      const existingProduct = await Product.findOne({
        farmer: userId,
        name: { $regex: `^${productName}$`, $options: 'i' },
        isActive: true
      });

      if (existingProduct) {
        // Update existing product
        existingProduct.quantity += quantity;
        existingProduct.price = pricePerUnit;
        existingProduct.updatedAt = new Date();
        await existingProduct.save();

        return {
          listingStatus: 'updated',
          product: {
            id: existingProduct._id,
            name: existingProduct.name,
            totalQuantity: existingProduct.quantity,
            price: existingProduct.price,
            unit: existingProduct.unit
          },
          message: `Great! I've updated your ${productName} listing. You now have ${existingProduct.quantity}${existingProduct.unit} available at ₹${existingProduct.price} per ${existingProduct.unit}.`,
          actions: ['View all listings', 'Add more products', 'Check market prices']
        };
      } else {
        // Create new product listing
        const newProduct = new Product({
          farmer: userId,
          name: productName,
          quantity: quantity,
          unit: unit || 'kg',
          price: pricePerUnit,
          farmerLocation: farmerLocation,
          isActive: true,
          organic: false, // Can be enhanced with AI detection
          quality: 'standard' // Default quality
        });

        await newProduct.save();

        return {
          listingStatus: 'created',
          product: {
            id: newProduct._id,
            name: newProduct.name,
            quantity: newProduct.quantity,
            price: newProduct.price,
            unit: newProduct.unit
          },
          message: `Excellent! I've listed your ${productName} (${quantity}${unit || 'kg'}) at ₹${pricePerUnit} per ${unit || 'kg'}. It's now available for customers to order!`,
          actions: ['Add more products', 'View my listings', 'Share with customers', 'Set notifications']
        };
      }

    } catch (error) {
      console.error('Product Listing Error:', error);
      return {
        listingStatus: 'error',
        message: "I encountered an issue while listing your product. Please try again."
      };
    }
  }

  // Add product to cart
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      if (!productId || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Product ID and quantity are required'
        });
      }

      // Check if product exists and is available
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Product not found or not available'
        });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.quantity}${product.unit} available`
        });
      }

      // Find or create cart (in addToCart method)
      // For chatbot integration, use a simple cart without farm requirement for now
      let cart = await Cart.findOne({ 
        user: userId
      });
      
      if (!cart) {
        cart = new Cart({ 
          user: userId,
          items: [] 
        });
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          product: productId,
          quantity: quantity,
          price: product.price
        });
      }

      await cart.save();
      await cart.populate('items.product');

      res.json({
        success: true,
        data: {
          message: `Added ${quantity}${product.unit} of ${product.name} to your cart!`,
          cart: cart,
          cartTotal: cart.items.reduce((total, item) => total + (item.quantity * item.price), 0)
        }
      });

    } catch (error) {
      console.error('Add to Cart Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add product to cart'
      });
    }
  }

  // Get nearby products for browsing
  async getNearbyProducts(req, res) {
    try {
      const { latitude, longitude, category, radius = 50000 } = req.query;

      let query = { isActive: true, quantity: { $gt: 0 } };

      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }

      if (latitude && longitude) {
        query.farmerLocation = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(radius)
          }
        };
      }

      const products = await Product.find(query)
        .populate('farmer', 'name location phone verified')
        .limit(20)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: {
          products: products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity: product.quantity,
            farmerName: product.farmer.name,
            farmerVerified: product.farmer.verified,
            organic: product.organic,
            quality: product.quality,
            distance: latitude && longitude ? 
              this.calculateDistance(
                { coordinates: [longitude, latitude] },
                product.farmerLocation
              ) : null
          }))
        }
      });

    } catch (error) {
      console.error('Get Nearby Products Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch nearby products'
      });
    }
  }

  // Utility functions
  calculateDistance(point1, point2) {
    if (!point1?.coordinates || !point2?.coordinates) return null;
    
    const [lon1, lat1] = point1.coordinates;
    const [lon2, lat2] = point2.coordinates;
    
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
  }

  getEstimatedDelivery(userLocation, farmerLocation) {
    const distance = this.calculateDistance(userLocation, farmerLocation);
    if (!distance) return 'Same day';
    
    if (distance < 10) return 'Same day';
    if (distance < 30) return '1-2 days';
    if (distance < 50) return '2-3 days';
    return '3-5 days';
  }

  // Process confirmed order
  async processOrderConfirmation(confirmationData, userId) {
    try {
      const { productId, quantity } = confirmationData;

      // Mock products for testing - in a real app, this would be a database lookup
      const mockProducts = {
        '507f1f77bcf86cd799439011': {
          _id: '507f1f77bcf86cd799439011',
          name: 'tomato',
          price: 25,
          unit: 'kg',
          quantity: 100,
          isActive: true
        },
        '507f1f77bcf86cd799439012': {
          _id: '507f1f77bcf86cd799439012', 
          name: 'potato',
          price: 20,
          unit: 'kg',
          quantity: 50,
          isActive: true
        },
        '507f1f77bcf86cd799439013': {
          _id: '507f1f77bcf86cd799439013',
          name: 'onion', 
          price: 30,
          unit: 'kg',
          quantity: 75,
          isActive: true
        },
        '507f1f77bcf86cd799439014': {
          _id: '507f1f77bcf86cd799439014',
          name: 'carrot',
          price: 35,
          unit: 'kg', 
          quantity: 40,
          isActive: true
        }
      };

      const product = mockProducts[productId];
      if (!product || !product.isActive) {
        return {
          message: "Sorry, this product is no longer available. Let me find you another option.",
          actions: ['🔍 Find similar products', '🛒 Browse all products']
        };
      }

      if (product.quantity < quantity) {
        return {
          message: `Sorry, only ${product.quantity}${product.unit} of ${product.name} is available. Would you like to order the available quantity instead?`,
          actions: [`✅ Order ${product.quantity}${product.unit}`, '🔍 Find other options']
        };
      }

      // Find or create cart
      // For chatbot integration, use a simple cart without farm requirement for now
      let cart = await Cart.findOne({ 
        user: userId
      });
      
      if (!cart) {
        cart = new Cart({ 
          user: userId,
          items: [] 
        });
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product && item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity;
        if (!cart.items[existingItemIndex].price) {
          cart.items[existingItemIndex].price = product.price;
        }
      } else {
        // Add new item - create a mock product reference for the cart
        cart.items.push({
          product: productId,
          quantity: quantity,
          price: product.price
        });
      }

      await cart.save();
      
      // For mock products, we need to simulate the populated cart response
      // Transform the cart to include product details that the frontend expects
      const cartResponse = {
        _id: cart._id,
        user: cart.user,
        items: cart.items.map(item => ({
          product: {
            _id: item.product,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: '/placeholder.jpg'
          },
          quantity: item.quantity,
          price: item.price
        })),
        farm: cart.farm
      };

      const totalCost = confirmationData.totalCost;
      
      return {
        message: `🎉 Perfect! I've added ${quantity}${confirmationData.unit} of ${confirmationData.productName} from ${confirmationData.farmerName} to your cart!

💰 Cost: ₹${totalCost}
🚚 Estimated delivery: Same day
🛒 Cart total: ₹${cartResponse.items.reduce((total, item) => total + (item.quantity * item.price), 0)}

What else would you like to order?`,
        orderProcessed: true,
        cartTotal: cartResponse.items.reduce((total, item) => total + (item.quantity * item.price), 0),
        cart: cartResponse,
        actions: ['🛒 View cart', '➕ Add more items', '💳 Proceed to checkout', '🏠 Continue shopping']
      };

    } catch (error) {
      console.error('Order Confirmation Error:', error);
      return {
        message: "I encountered an issue while adding the item to your cart. Please try again.",
        actions: ['🔄 Try again', '🛒 View cart']
      };
    }
  }

  // Process confirmed listing
  async processListingConfirmation(confirmationData, userId, farmerLocation) {
    try {
      const { productName, quantity, unit, pricePerUnit } = confirmationData;

      // Check if farmer already has this product listed
      const existingProduct = await Product.findOne({
        farmer: userId,
        name: { $regex: `^${productName}$`, $options: 'i' },
        isActive: true
      });

      if (existingProduct) {
        // Update existing product
        existingProduct.quantity += quantity;
        existingProduct.price = pricePerUnit;
        existingProduct.updatedAt = new Date();
        await existingProduct.save();

        return {
          message: `🎉 Excellent! I've updated your ${productName} listing!

📦 Total quantity: ${existingProduct.quantity}${existingProduct.unit}
💰 Price: ₹${existingProduct.price} per ${existingProduct.unit}
💵 Total value: ₹${existingProduct.quantity * existingProduct.price}

Your updated listing is now live for customers to see!`,
          listingProcessed: true,
          listingStatus: 'updated',
          product: {
            id: existingProduct._id,
            name: existingProduct.name,
            totalQuantity: existingProduct.quantity,
            price: existingProduct.price,
            unit: existingProduct.unit,
            totalValue: existingProduct.quantity * existingProduct.price
          },
          actions: ['📊 View all listings', '➕ Add more products', '💰 Check earnings', '📱 Set notifications']
        };
      } else {
        // Create new product listing
        const newProduct = new Product({
          farmer: userId,
          name: productName,
          quantity: quantity,
          unit: unit || 'kg',
          price: pricePerUnit,
          farmerLocation: farmerLocation,
          isActive: true,
          organic: false, // Can be enhanced with AI detection
          quality: 'standard' // Default quality
        });

        await newProduct.save();

        return {
          message: `🌟 Fantastic! Your ${productName} is now listed and available for customers!

📦 Quantity: ${quantity}${unit || 'kg'}
💰 Price: ₹${pricePerUnit} per ${unit || 'kg'}
💵 Potential earnings: ₹${quantity * pricePerUnit}

Your listing is live and customers within 50km can now see and order your fresh ${productName}!`,
          listingProcessed: true,
          listingStatus: 'created',
          product: {
            id: newProduct._id,
            name: newProduct.name,
            quantity: newProduct.quantity,
            price: newProduct.price,
            unit: newProduct.unit,
            totalValue: quantity * pricePerUnit
          },
          actions: ['➕ Add more products', '📊 View my listings', '📤 Share with customers', '🔔 Set alerts']
        };
      }

    } catch (error) {
      console.error('Listing Confirmation Error:', error);
      return {
        message: "I encountered an issue while listing your product. Please try again.",
        actions: ['🔄 Try again', '📊 View listings']
      };
    }
  }
}

export default new ChatController();
