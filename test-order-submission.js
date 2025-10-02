// Test script to isolate order submission issues
const http = require('http');

const testOrder = {
  customerName: 'Debug Test User',
  customerEmail: 'debug@example.com',
  customerPhone: '08012345678',
  orderType: 'pickup',
  scheduledDate: '2024-12-25',
  scheduledTime: '10:00',
  notes: 'Debug test order',
  products: [{
    productId: 'premium-mentorship',
    name: 'Premium Mentorship Program',
    quantity: 1,
    priceNaira: 160000
  }],
  totalAmount: 160000,
  status: 'new',
  createdAt: new Date().toISOString()
};

const postData = JSON.stringify(testOrder);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('�� Testing direct API call...');
console.log('📤 Sending:', JSON.stringify(testOrder, null, 2));

const req = http.request(options, (res) => {
  console.log('📥 Response status:', res.statusCode);
  console.log('📥 Response headers:', res.headers);
  
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('📥 Response body:', body);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ API call successful');
    } else {
      console.log('❌ API call failed');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
  if (e.code === 'ECONNREFUSED') {
    console.log('💡 Development server not running');
    console.log('💡 Start with: pnpm run dev');
  }
});

req.write(postData);
req.end();
