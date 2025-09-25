// Basic smoke test for chat controller without full server route auto-loader
const express = require('express');
const bodyParser = require('body-parser');

async function loadController() {
  const mod = await import('../controllers/chatController.js');
  return mod.default || mod;
}

async function buildApp() {
  const chatController = await loadController();
  const app = express();
  app.use(bodyParser.json());
  app.post('/api/chat/message', (req,res)=> chatController.sendMessage(req,res));
  return app;
}

async function run() {
  const app = await buildApp();
  const server = app.listen(0);
  await new Promise(r=>setTimeout(r,50));
  const port = server.address().port;
  const resp = await fetch(`http://localhost:${port}/api/chat/message`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ message:'Order 3 kg tomato', userRole:'buyer', conversationHistory:[] })
  });
  const json = await resp.json();
  console.log('Smoke response', JSON.stringify(json,null,2));
  server.close();
}

if (require.main === module) {
  run();
}
