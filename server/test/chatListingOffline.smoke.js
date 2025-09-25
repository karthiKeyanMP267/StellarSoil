import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// This assumes server running locally on 5000. Adjust if needed.
async function run() {
  process.env.FORCE_DB_OFFLINE = 'true';
  const endpoint = 'http://localhost:5000/api/chat/message';
  const testUserId = '64b000000000000000000001';

  const conversationHistory = [];
  const listingRequest = {
    message: 'List 10 kg of organic tomatoes at 55 per kg',
    userRole: 'farmer',
    conversationHistory,
    testUserId
  };
  const r1 = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(listingRequest)});
  const j1 = await r1.json();
  console.log('Initial listing request intent:', j1.data?.intent, 'requiresConfirmation:', j1.data?.requiresConfirmation);

  const pending = j1.data?.pendingConfirmation;
  if (!pending) {
    console.error('No pending listing confirmation found – aborting');
    return;
  }

  const confirmReq = {
    message: 'yes list it',
    userRole: 'farmer',
    conversationHistory: [ ...conversationHistory, { role:'user', content: listingRequest.message }, { role:'assistant', content: j1.data.message } ],
    pendingConfirmation: pending,
    testUserId
  };
  const r2 = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(confirmReq)});
  const j2 = await r2.json();
  console.log('Confirmation processed listingStatus:', j2.data?.listingStatus);
  console.log('Message snippet:', (j2.data?.message || '').slice(0,140));
  console.log('Simulated offline:', /offline|simulation/i.test(j2.data?.message||''));
}

run().catch(e=>{ console.error(e); process.exit(1); });
