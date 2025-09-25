/* Multi-flow smoke test for chat controller
   Simulates:
   1. Buyer ordering product (request + confirmation)
   2. Farmer listing product (request + confirmation)
*/
const express = require('express');
const bodyParser = require('body-parser');
async function loadController(){ const mod = await import('../controllers/chatController.js'); return mod.default || mod; }

async function buildApp(){ const chatController = await loadController(); const app = express(); app.use(bodyParser.json()); app.post('/api/chat/message',(req,res)=>chatController.sendMessage(req,res)); return app; }

async function post(port, body){ const r = await fetch(`http://localhost:${port}/api/chat/message`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); return r.json(); }

async function run(){ const app = await buildApp(); const server = app.listen(0); await new Promise(r=>setTimeout(r,50)); const port = server.address().port; const userId = '000000000000000000000001';
  console.log('\n[Flow 1] Buyer order request');
  const orderReq = await post(port,{ message:'Order 2 kg tomato', userRole:'buyer', conversationHistory:[], testUserId:userId });
  console.log(JSON.stringify(orderReq,null,2));
  if(orderReq.data?.pendingConfirmation){
    console.log('\n[Flow 1] Confirming order');
    const confirm = await post(port,{ message:'yes confirm', userRole:'buyer', conversationHistory:[{sender:'user',text:'Order 2 kg tomato'}], pendingConfirmation: orderReq.data.pendingConfirmation, testUserId:userId });
    console.log(JSON.stringify(confirm,null,2));
  }
  console.log('\n[Flow 2] Farmer listing request');
  const listingReq = await post(port,{ message:'List 40 kg potato at 22 rupees', userRole:'farmer', conversationHistory:[], testUserId:userId });
  console.log(JSON.stringify(listingReq,null,2));
  if(listingReq.data?.pendingConfirmation){
    console.log('\n[Flow 2] Confirm listing');
    const listingConfirm = await post(port,{ message:'yes list it', userRole:'farmer', conversationHistory:[{sender:'user',text:'List 40 kg potato at 22 rupees'}], pendingConfirmation: listingReq.data.pendingConfirmation, testUserId:userId });
    console.log(JSON.stringify(listingConfirm,null,2));
  }
  server.close();
}
if(require.main===module){ run(); }
