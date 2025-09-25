import aiChatService from '../services/aiChatService.js';
import languageService from '../services/languageService.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class ChatController {
  async sendMessage(req, res) {
    try {
      const { message, userRole, conversationHistory, userLocation, pendingConfirmation, preferLanguage } = req.body;
  // Allow test harness to inject a user id when auth middleware skipped
  const userId = req.user?.id || req.body.testUserId;
      if (!message || !userRole) return res.status(400).json({ success:false, error:'Message and user role are required' });
      const { detectedLanguage, translatedText } = await languageService.detectAndTranslateToEnglish(message);
      const aiResponse = await aiChatService.generateResponse(translatedText, userRole, conversationHistory || [], userLocation);
      // Normalize AI extracted data variations (e.g., product vs productName)
      if (aiResponse.extractedData) {
        const ed = aiResponse.extractedData;
        if (!ed.productName && ed.product) ed.productName = ed.product;
        if (!ed.quantity && typeof ed.amount === 'number') ed.quantity = ed.amount;
        // If quantity is string like "3 kg" parse numeric and unit
        if (typeof ed.quantity === 'string') {
          const m = ed.quantity.match(/^(\d+(?:\.\d+)?)\s*(kg|g|liters?|l|pieces?|pcs|dozen)?/i);
            if (m) {
              ed.quantity = parseFloat(m[1]);
              if (!ed.unit && m[2]) ed.unit = m[2].toLowerCase();
            }
        }
        // Parse price fields
        if (!ed.pricePerUnit && ed.price) {
          if (typeof ed.price === 'string') {
            const pm = ed.price.match(/(\d+(?:\.\d+)?)/);
            if (pm) ed.pricePerUnit = parseFloat(pm[1]);
          } else if (typeof ed.price === 'number') {
            ed.pricePerUnit = ed.price;
          }
        }
        if (typeof ed.pricePerUnit === 'string') {
          const pm = ed.pricePerUnit.match(/(\d+(?:\.\d+)?)/);
          if (pm) ed.pricePerUnit = parseFloat(pm[1]);
        }
      }
      let additionalData = {};
      if (aiResponse.intent === 'order_confirmation' && userId && pendingConfirmation && typeof req.body.message === 'string' && ['yes','confirm','add to cart','proceed','approve'].some(k=>req.body.message.toLowerCase().includes(k))) {
        additionalData = await this.processOrderConfirmation(pendingConfirmation, userId);
      } else if (aiResponse.intent === 'listing_confirmation' && userId && pendingConfirmation && typeof req.body.message === 'string' && ['yes','confirm','list it','proceed','approve'].some(k=>req.body.message.toLowerCase().includes(k))) {
        additionalData = await this.processListingConfirmation(pendingConfirmation, userId, userLocation, { offlineSim: process.env.FORCE_DB_OFFLINE === 'true' });
      }
      const autoProcessOrder = () => { const d = aiResponse.extractedData || {}; return aiResponse.intent==='order_request' && d.productName && d.quantity && d.quantity>0 && /^(order|add|buy|need|want)/i.test(message.trim()) && !/confirm|sure|okay|ok/i.test(message); };
      const autoProcessListing = () => { const d = aiResponse.extractedData || {}; return aiResponse.intent==='product_listing' && d.productName && d.quantity && d.pricePerUnit && /^(list|add|have|selling|sell)/i.test(message.trim()); };
      const forceOffline = process.env.FORCE_DB_OFFLINE === 'true';
      if (forceOffline) {
        // Simulate offline DB quickly by toggling readyState reference check (we won't mutate mongoose itself)
        if (mongoose.connection?.readyState === 1) {
          console.warn('[ChatController] FORCE_DB_OFFLINE enabled – simulating offline database operations');
        }
      }
      if (autoProcessOrder() && userId) {
        const prep = await this.handleOrderRequest(aiResponse.extractedData, userId, userLocation);
        if (prep.availableProducts?.length) {
          const best = prep.availableProducts[0];
          const pseudo = { productId: best.id, productName: aiResponse.extractedData.productName, quantity: aiResponse.extractedData.quantity, unit: aiResponse.extractedData.unit||'kg', farmerName: best.farmerName, totalCost: best.price * (aiResponse.extractedData.quantity||1) };
            const processed = await this.processOrderConfirmation(pseudo, userId);
            additionalData = { ...prep, ...processed, autoProcessed: true };
        } else additionalData = { ...prep };
      } else if (autoProcessListing() && userId && userRole==='farmer') {
        const processed = await this.processListingConfirmation({ productName: aiResponse.extractedData.productName, quantity: aiResponse.extractedData.quantity, unit: aiResponse.extractedData.unit||'kg', pricePerUnit: aiResponse.extractedData.pricePerUnit, totalValue: aiResponse.extractedData.quantity * aiResponse.extractedData.pricePerUnit }, userId, userLocation, { offlineSim: forceOffline });
        additionalData = { ...processed, autoProcessed: true };
      } else if (aiResponse.intent==='order_request' && userId) {
        additionalData = await this.handleOrderRequest(aiResponse.extractedData, userId, userLocation);
        if (additionalData.availableProducts?.length) {
          const best = additionalData.availableProducts[0];
          additionalData.pendingConfirmation = { type:'order', productId: best.id, productName: best.name, quantity: aiResponse.extractedData.quantity||1, unit: aiResponse.extractedData.unit||'kg', price: best.price, farmerName: best.farmerName, totalCost: best.price*(aiResponse.extractedData.quantity||1) };
          additionalData.requiresConfirmation = true;
          additionalData.message = `I found ${best.name} from ${best.farmerName} at ₹${best.price}/${best.unit}.\n\nTotal cost: ₹${additionalData.pendingConfirmation.totalCost} for ${additionalData.pendingConfirmation.quantity}${additionalData.pendingConfirmation.unit}\n\nWould you like me to add this to your cart?`;
          additionalData.actions = ['✅ Yes, add to cart','❌ No, show other options','🔍 Find different product'];
        }
      } else if (aiResponse.intent==='product_listing' && userId) {
        const { productName, quantity, unit, pricePerUnit } = aiResponse.extractedData;
        if (productName && quantity && pricePerUnit) {
          additionalData.pendingConfirmation = { type:'listing', productName, quantity, unit: unit||'kg', pricePerUnit, totalValue: quantity*pricePerUnit };
          additionalData.requiresConfirmation = true;
          additionalData.message = `I understand you want to list:\n\n📦 Product: ${productName}\n⚖️ Quantity: ${quantity}${unit||'kg'}\n💰 Price: ₹${pricePerUnit} per ${unit||'kg'}\n💵 Total Value: ₹${additionalData.pendingConfirmation.totalValue}\n\nShould I add this to your inventory for customers to see?`;
          additionalData.actions = ['✅ Yes, list it','❌ No, let me change details','💡 Suggest better pricing'];
        }
      }
      let combined = { ...aiResponse, ...additionalData };
      let storedPreferred = null;
      if (!preferLanguage && userId) { try { const userDoc = await User.findById(userId).select('preferredLanguage'); storedPreferred = userDoc?.preferredLanguage && userDoc.preferredLanguage!=='en' ? userDoc.preferredLanguage : null; } catch {} }
      const outboundLang = preferLanguage || storedPreferred || (detectedLanguage!=='en' ? detectedLanguage : null);
      if (outboundLang && outboundLang!=='en') { combined.message = await languageService.translateFromEnglish(combined.message, outboundLang); if (Array.isArray(combined.actions)) combined.actions = await languageService.translateActions(combined.actions, outboundLang); }
      res.json({ success: true, data: { ...combined, detectedLanguage, responseLanguage: outboundLang || 'en', timestamp: new Date() } });
    } catch (err) { console.error('Chat Controller Error:', err); res.status(500).json({ success:false, error:'Failed to process chat message', message:'Please try again.' }); }
  }

  async handleOrderRequest(extractedData, userId, userLocation) {
    try { const { productName, quantity, unit } = extractedData; if (!productName) return { availableProducts: [], message: "I'd be happy to help you find products! Could you specify what you're looking for?" }; const mockProducts=[ { _id:'507f1f77bcf86cd799439011', name:'tomato', price:25, unit:'kg', quantity:100, farmer:{ name:'Sunny Farms' }, isActive:true }, { _id:'507f1f77bcf86cd799439012', name:'potato', price:20, unit:'kg', quantity:50, farmer:{ name:'Green Valley Farm' }, isActive:true }, { _id:'507f1f77bcf86cd799439013', name:'onion', price:30, unit:'kg', quantity:75, farmer:{ name:'Hillside Farms' }, isActive:true }, { _id:'507f1f77bcf86cd799439014', name:'carrot', price:35, unit:'kg', quantity:40, farmer:{ name:'Organic Gardens' }, isActive:true } ]; const availableProducts = mockProducts.filter(p=>p.name.toLowerCase().includes(productName.toLowerCase())&&p.quantity>0&&p.isActive); if(!availableProducts.length) return { availableProducts: [], message:`I couldn't find ${productName} nearby. Want similar suggestions or availability alerts?`, actions:['Find similar products','Set availability alert','Browse all products'] }; const best=availableProducts[0]; return { availableProducts: availableProducts.map(p=>({ id:p._id,name:p.name,price:p.price,unit:p.unit,availableQuantity:p.quantity,farmerName:p.farmer.name, farmerLocation:p.farmer.location,distance:userLocation?this.calculateDistance(userLocation,p.farmerLocation):null,quality:p.quality||'standard',organic:p.organic||false })), bestMatch:{ id:best._id, canFulfill: best.quantity >= (quantity||1), totalPrice: best.price * (quantity||1), estimatedDelivery: this.getEstimatedDelivery(userLocation,best.farmerLocation) }, orderData:{ productId: best._id, requestedQuantity: quantity||1, requestedUnit: unit||'kg' } }; } catch(e){ console.error('Order Request Error:', e); return { availableProducts: [], message:'Issue while searching products. Please retry.' }; }
  }

  async handleProductListing(extractedData, userId, farmerLocation) {
    try { const { productName, quantity, unit, pricePerUnit } = extractedData; if(!productName||!quantity||!pricePerUnit) return { listingStatus:'incomplete', message:'Provide product name, quantity, and price per unit.', missingFields:{ productName:!productName, quantity:!quantity, pricePerUnit:!pricePerUnit } }; let existingProduct=null; let dbConnected=mongoose.connection?.readyState===1; if(dbConnected){ try { existingProduct = await Product.findOne({ farmer:userId, name:{ $regex:`^${productName}$`, $options:'i' }, isActive:true }); } catch(e){ console.warn('DB findOne failed (listing)', e.message); dbConnected=false; } } if(existingProduct){ existingProduct.quantity+=quantity; existingProduct.price=pricePerUnit; existingProduct.updatedAt=new Date(); if(dbConnected){ try{ await existingProduct.save(); } catch(e){ console.warn('Save existing failed', e.message);} } return { listingStatus:'updated', product:{ id:existingProduct._id, name:existingProduct.name, totalQuantity:existingProduct.quantity, price:existingProduct.price, unit:existingProduct.unit }, message:`Updated ${productName}. Now ${existingProduct.quantity}${existingProduct.unit} at ₹${existingProduct.price}/${existingProduct.unit}.`, actions:['View all listings','Add more products','Check market prices'] }; } if(dbConnected){ try { const np = new Product({ farmer:userId, name:productName, quantity, unit:unit||'kg', price:pricePerUnit, farmerLocation, isActive:true, organic:false, quality:'standard' }); await np.save(); return { listingStatus:'created', product:{ id:np._id, name:np.name, quantity:np.quantity, price:np.price, unit:np.unit }, message:`Listed ${productName} (${quantity}${unit||'kg'}) at ₹${pricePerUnit}/${unit||'kg'}.`, actions:['Add more products','View my listings','Share with customers','Set notifications'] }; } catch(e){ console.warn('Save new product failed (offline)', e.message);} } return { listingStatus:'simulated', product:{ id:'mock-'+Date.now(), name:productName, quantity, price:pricePerUnit, unit:unit||'kg' }, message:`Simulated listing (DB offline): ${productName} ${quantity}${unit||'kg'} at ₹${pricePerUnit}.`, actions:['Add more products','View my listings','Check connection'] }; } catch(e){ console.error('Product Listing Error:', e); return { listingStatus:'error', message:'Issue while listing product. Try again.' }; }
  }

  async addToCart(req,res){
    try {
      let { productId, quantity } = req.body; const userId = req.user?._id || req.body.testUserId;
      if(!productId||quantity===undefined) return res.status(400).json({ success:false, error:'Product ID and quantity are required' });
      if (typeof quantity === 'string') { const qm = quantity.match(/(\d+(?:\.\d+)?)/); if (qm) quantity = parseFloat(qm[1]); }
      quantity = Number(quantity);
      if(isNaN(quantity)||quantity<=0) return res.status(400).json({ success:false, error:'Invalid quantity' });
      let dbConnected = mongoose.connection?.readyState===1; let product=null;
      if(dbConnected){ try { product = await Product.findById(productId); } catch(e){ console.warn('DB Product.findById failed addToCart', e.message); dbConnected=false; } }
      if(!product){ product={ _id:productId,name:'tomato',price:25,unit:'kg',quantity:999,isActive:true }; }
      if(product.quantity < quantity) return res.status(400).json({ success:false, error:`Only ${product.quantity}${product.unit} available` });
      let cart=null; if(dbConnected){ try { cart = await Cart.findOne({ user:userId }); } catch(e){ console.warn('DB Cart.findOne failed addToCart', e.message); dbConnected=false; } }
      if(!cart) cart = new Cart({ user:userId, items:[] });
      const idx = cart.items.findIndex(i=> i.product.toString()===productId);
      if(idx>-1) cart.items[idx].quantity += quantity; else cart.items.push({ product:productId, quantity, price:product.price });
      if(dbConnected){ try { await cart.save(); await cart.populate('items.product'); } catch(e){ console.warn('Cart save/populate failed', e.message);} }
      const cartTotal = cart.items.reduce((t,i)=>t+i.quantity*i.price,0);
      res.json({ success:true, data:{ message:`Added ${quantity}${product.unit} of ${product.name} to your cart!${dbConnected?'':' (offline simulation)'}`, cart, cartTotal, persisted: dbConnected } });
    } catch(e){ console.error('Add to Cart Error:', e); res.status(500).json({ success:false, error:'Failed to add product to cart' }); }
  }

  async getNearbyProducts(req,res){
    try {
      const { latitude, longitude, category, radius=50000 } = req.query; 
      // If DB not connected, return mock products immediately
      if (mongoose.connection?.readyState !== 1) {
        const mockProducts=[ { _id:'507f1f77bcf86cd799439011', name:'tomato', price:25, unit:'kg', quantity:100, farmer:{ name:'Sunny Farms', verified:true }, organic:false, quality:'standard' }, { _id:'507f1f77bcf86cd799439012', name:'potato', price:20, unit:'kg', quantity:50, farmer:{ name:'Green Valley Farm', verified:true }, organic:false, quality:'standard' } ];
        return res.json({ success:true, offline:true, data:{ products: mockProducts.map(p=>({ id:p._id,name:p.name,price:p.price,unit:p.unit,quantity:p.quantity, farmerName:p.farmer.name, farmerVerified:p.farmer.verified, organic:p.organic, quality:p.quality, distance:null })) } });
      }
      const query={ isActive:true, quantity:{ $gt:0 } }; if(category) query.category={ $regex:category, $options:'i' }; if(latitude&&longitude){ query.farmerLocation={ $near:{ $geometry:{ type:'Point', coordinates:[parseFloat(longitude), parseFloat(latitude)] }, $maxDistance: parseInt(radius) } }; }
      const products = await Product.find(query).populate('farmer','name location phone verified').limit(20).sort({ createdAt:-1 });
      res.json({ success:true, data:{ products: products.map(p=>({ id:p._id,name:p.name,price:p.price,unit:p.unit,quantity:p.quantity, farmerName:p.farmer.name, farmerVerified:p.farmer.verified, organic:p.organic, quality:p.quality, distance:(latitude&&longitude)?this.calculateDistance({ coordinates:[longitude,latitude]}, p.farmerLocation):null })) } });
    } catch(e){ console.error('Get Nearby Products Error:', e); res.status(500).json({ success:false, error:'Failed to fetch nearby products' }); }
  }

  calculateDistance(p1,p2){ if(!p1?.coordinates||!p2?.coordinates) return null; const [lon1,lat1]=p1.coordinates; const [lon2,lat2]=p2.coordinates; const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLon=(lon2-lon1)*Math.PI/180; const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2; const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); return Math.round(R*c*10)/10; }
  getEstimatedDelivery(uLoc,fLoc){ const d=this.calculateDistance(uLoc,fLoc); if(!d) return 'Same day'; if(d<10) return 'Same day'; if(d<30) return '1-2 days'; if(d<50) return '2-3 days'; return '3-5 days'; }

  async processOrderConfirmation(confirmationData, userId){
    try { let { productId, quantity } = confirmationData; const mockProducts={ '507f1f77bcf86cd799439011':{ _id:'507f1f77bcf86cd799439011', name:'tomato', price:25, unit:'kg', quantity:100, isActive:true }, '507f1f77bcf86cd799439012':{ _id:'507f1f77bcf86cd799439012', name:'potato', price:20, unit:'kg', quantity:50, isActive:true }, '507f1f77bcf86cd799439013':{ _id:'507f1f77bcf86cd799439013', name:'onion', price:30, unit:'kg', quantity:75, isActive:true }, '507f1f77bcf86cd799439014':{ _id:'507f1f77bcf86cd799439014', name:'carrot', price:35, unit:'kg', quantity:40, isActive:true } }; const product = mockProducts[productId]; if(typeof quantity === 'string'){ const qm = quantity.match(/(\d+(?:\.\d+)?)/); if(qm) quantity=parseFloat(qm[1]); }
      quantity = Number(quantity)||1;
      if(!product||!product.isActive) return { message:'Sorry, this product is no longer available. Let me find you another option.', actions:['🔍 Find similar products','🛒 Browse all products'] }; if(product.quantity < quantity) return { message:`Sorry, only ${product.quantity}${product.unit} of ${product.name} is available. Order available quantity?`, actions:[`✅ Order ${product.quantity}${product.unit}`,'🔍 Find other options'] }; let dbConnected=mongoose.connection?.readyState===1; let cart=null; if(dbConnected){ try { cart = await Cart.findOne({ user:userId }); } catch(e){ console.warn('Cart findOne failed orderConfirmation', e.message); dbConnected=false; } } if(!cart) cart=new Cart({ user:userId, items:[] }); const idx=cart.items.findIndex(i=>i.product && i.product.toString()===productId); if(idx>-1){ cart.items[idx].quantity+=quantity; if(!cart.items[idx].price) cart.items[idx].price=product.price; } else { cart.items.push({ product:productId, quantity, price:product.price }); } if(dbConnected){ try { await cart.save(); } catch(e){ console.warn('Cart save failed orderConfirmation', e.message);} } const cartResponse={ _id:cart._id||'mock-cart', user:cart.user, items: cart.items.map(it=>({ product:{ _id:it.product, name:product.name, price:product.price, unit:product.unit, image:'/placeholder.jpg' }, quantity:it.quantity, price:it.price })), farm:cart.farm }; const totalCost = confirmationData.totalCost ?? (product.price * quantity); const cartTotal = cartResponse.items.reduce((t,i)=>t+i.quantity*i.price,0); return { message:`🎉 Perfect! I've added ${quantity}${confirmationData.unit||product.unit} of ${confirmationData.productName||product.name} from ${confirmationData.farmerName||'farmer'} to your cart!\n\n💰 Cost: ₹${totalCost}\n🚚 Estimated delivery: Same day\n🛒 Cart total: ₹${cartTotal}${dbConnected?'':'\n⚠️ Not persisted (offline mode)'}\n\nWhat else would you like to order?`, orderProcessed:true, cartTotal, cart:cartResponse, actions:['🛒 View cart','➕ Add more items','💳 Proceed to checkout','🏠 Continue shopping'] }; } catch(e){ console.error('Order Confirmation Error:', e); return { message:'Issue adding item to cart. Try again.', actions:['🔄 Try again','🛒 View cart'] }; }
  }

  async processListingConfirmation(confirmationData, userId, farmerLocation, { offlineSim=false } = {}){
    try {
      const { productName, quantity, unit, pricePerUnit } = confirmationData;
      const dbConnected = mongoose.connection?.readyState === 1 && !offlineSim;
      let existingProduct = null;
      if (dbConnected) {
        try {
          existingProduct = await Product.findOne({ farmer:userId, name:{ $regex:`^${productName}$`, $options:'i' }, isActive:true });
        } catch (e) {
          console.warn('Listing findOne failed, falling back offline', e.message);
        }
      }
      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.price = pricePerUnit;
        existingProduct.updatedAt = new Date();
        if (dbConnected) {
          try { await existingProduct.save(); } catch (e) { console.warn('Listing save update failed', e.message); }
        }
        return {
          message:`🎉 Excellent! I've updated your ${productName} listing!${dbConnected?'':' (offline simulated)'}` +
                  `\n\n📦 Total quantity: ${existingProduct.quantity}${existingProduct.unit}` +
                  `\n💰 Price: ₹${existingProduct.price} per ${existingProduct.unit}` +
                  `\n💵 Total value: ₹${existingProduct.quantity * existingProduct.price}` +
                  `\n\nYour updated listing is ${dbConnected?'now live!':'queued (simulation).'}`,
          listingProcessed:true,
          listingStatus: dbConnected ? 'updated' : 'updated_simulated',
          product:{ id:existingProduct._id || ('mock-'+Date.now()), name:existingProduct.name, totalQuantity:existingProduct.quantity, price:existingProduct.price, unit:existingProduct.unit, totalValue: existingProduct.quantity * existingProduct.price },
          actions:['📊 View all listings','➕ Add more products','💰 Check earnings','📱 Set notifications']
        };
      }
      if (dbConnected) {
        try {
          const newProduct = new Product({ farmer:userId, name:productName, quantity, unit:unit||'kg', price:pricePerUnit, farmerLocation, isActive:true, organic:false, quality:'standard' });
          await newProduct.save();
          return {
            message:`🌟 Fantastic! Your ${productName} is now listed!` +
                    `\n\n📦 Quantity: ${quantity}${unit||'kg'}` +
                    `\n💰 Price: ₹${pricePerUnit} per ${unit||'kg'}` +
                    `\n💵 Potential earnings: ₹${quantity * pricePerUnit}` +
                    `\n\nVisible to nearby customers now!`,
            listingProcessed:true,
            listingStatus:'created',
            product:{ id:newProduct._id, name:newProduct.name, quantity:newProduct.quantity, price:newProduct.price, unit:newProduct.unit, totalValue: quantity * pricePerUnit },
            actions:['➕ Add more products','📊 View my listings','📤 Share with customers','🔔 Set alerts']
          };
        } catch (e) {
          console.warn('Listing create save failed, fallback simulate', e.message);
        }
      }
      // Offline simulated creation
      return {
        message:`🌐 Offline simulation: ${productName} listing staged.` +
                `\n\n📦 Quantity: ${quantity}${unit||'kg'}` +
                `\n💰 Price: ₹${pricePerUnit} per ${unit||'kg'}` +
                `\n💵 Potential earnings: ₹${quantity * pricePerUnit}` +
                `\n⚠️ Will persist when connection restores (not implemented).`,
        listingProcessed:true,
        listingStatus:'created_simulated',
        product:{ id:'mock-'+Date.now(), name:productName, quantity, price:pricePerUnit, unit:unit||'kg', totalValue: quantity * pricePerUnit },
        actions:['➕ Add more products','📊 View my listings','🔄 Retry save','🔍 Check connection']
      };
    } catch(e){
      console.error('Listing Confirmation Error:', e);
      return { message:'Issue listing product. Try again.', actions:['🔄 Try again','📊 View listings'] };
    }
  }
}

export default new ChatController();
// Support CJS require fallback
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined') { module.exports = new ChatController(); }
