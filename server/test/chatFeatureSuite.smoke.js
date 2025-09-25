/* Comprehensive feature smoke suite
   Scenarios:
   1. Buyer order request -> confirm -> ensure orderProcessed
   2. Farmer listing request -> confirm -> ensure listingProcessed
   3. Add to cart endpoint (offline fallback) with mock product
   4. Nearby products query (will return empty or results depending on DB)
*/
const express = require('express');
const bodyParser = require('body-parser');
const fetch = global.fetch;
async function loadController(){ const mod = await import('../controllers/chatController.js'); return mod.default || mod; }
async function buildApp(){ const cc = await loadController(); const app = express(); app.use(bodyParser.json()); app.post('/api/chat/message',(req,res)=>cc.sendMessage(req,res)); app.post('/api/chat/add-to-cart',(req,res)=>cc.addToCart(req,res)); app.get('/api/chat/nearby-products',(req,res)=>cc.getNearbyProducts(req,res)); return app; }
async function http(base, path, options){ const r = await fetch(base+path, options); const j = await r.json(); return { status:r.status, body:j }; }

(async function run(){ const app = await buildApp(); const server = app.listen(0); await new Promise(r=>setTimeout(r,50)); const port = server.address().port; const base = `http://localhost:${port}`; const userId='000000000000000000000001';
  const results = {};
  // 1. Order request
  const order1 = await http(base,'/api/chat/message',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message:'Order 3 kg tomato', userRole:'buyer', testUserId:userId }) });
  results.orderRequest = order1.body;
  if(order1.body?.data?.pendingConfirmation){
    const confirmOrder = await http(base,'/api/chat/message',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message:'yes confirm', userRole:'buyer', testUserId:userId, pendingConfirmation: order1.body.data.pendingConfirmation }) });
    results.orderConfirmation = confirmOrder.body;
  }
  // 2. Listing request
  const listingReq = await http(base,'/api/chat/message',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message:'List 25 kg onion at 30 rupees', userRole:'farmer', testUserId:userId }) });
  results.listingRequest = listingReq.body;
  if(listingReq.body?.data?.pendingConfirmation){
    const listingConfirm = await http(base,'/api/chat/message',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message:'yes list it', userRole:'farmer', testUserId:userId, pendingConfirmation: listingReq.body.data.pendingConfirmation }) });
    results.listingConfirmation = listingConfirm.body;
  }
  // 3. Add to cart (simulate product id not in DB => fallback mock path)
  const addCart = await http(base,'/api/chat/add-to-cart',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ productId:'507f1f77bcf86cd799439011', quantity:2, testUserId:userId }) });
  results.addToCart = addCart.body;
  // 4. Nearby products (may be empty if DB not connected)
  const nearby = await http(base,'/api/chat/nearby-products',{ method:'GET' });
  results.nearbyProducts = nearby.body;
  // Print concise summary
  const summary = {
    orderIntent: results.orderRequest?.data?.intent,
    orderPending: !!results.orderRequest?.data?.pendingConfirmation,
    orderProcessed: results.orderConfirmation?.data?.orderProcessed || false,
    listingIntent: results.listingRequest?.data?.intent,
    listingPending: !!results.listingRequest?.data?.pendingConfirmation,
    listingProcessed: results.listingConfirmation?.data?.listingProcessed || false,
    addToCartSuccess: results.addToCart?.success,
    cartPersisted: results.addToCart?.data?.persisted,
    nearbyCount: results.nearbyProducts?.data?.products?.length || 0
  };
  console.log('\n--- Feature Suite Summary ---');
  console.log(summary);
  console.log('\nFull Raw Results (truncated message fields)');
  function trim(o){ if(!o) return o; return JSON.parse(JSON.stringify(o, (k,v)=> typeof v==='string' && v.length>200 ? v.slice(0,200)+'…' : v)); }
  console.dir({results: trim(results)},{depth:4});
  server.close();
})();
