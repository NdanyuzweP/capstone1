const io = require('socket.io-client');

// Test socket connection and user interest updates
async function testSocketConnection() {
  console.log('🧪 Testing Socket Connection and User Interest System...\n');

  // Test 1: Connect as a driver
  console.log('1. Testing driver socket connection...');
  const driverSocket = io('https://capstone1-60ax.onrender.com', {
    auth: { token: 'test-driver-token' },
    transports: ['websocket', 'polling']
  });

  driverSocket.on('connect', () => {
    console.log('✅ Driver socket connected successfully');
  });

  driverSocket.on('connect_error', (error) => {
    console.log('❌ Driver socket connection error:', error.message);
  });

  // Test 2: Connect as a user
  console.log('\n2. Testing user socket connection...');
  const userSocket = io('https://capstone1-60ax.onrender.com', {
    auth: { token: 'test-user-token' },
    transports: ['websocket', 'polling']
  });

  userSocket.on('connect', () => {
    console.log('✅ User socket connected successfully');
  });

  userSocket.on('connect_error', (error) => {
    console.log('❌ User socket connection error:', error.message);
  });

  // Test 3: Simulate user interest update
  console.log('\n3. Testing user interest update...');
  
  // Simulate a user showing interest in a bus
  const mockInterestData = {
    busId: 'test-bus-id',
    userId: 'test-user-id',
    userName: 'Test User',
    pickupPointId: 'test-pickup-id',
    pickupPointName: 'Test Pickup Point',
    action: 'added'
  };

  // Emit user interest update
  userSocket.emit('user_interest_update', mockInterestData);
  console.log('📤 Emitted user interest update:', mockInterestData);

  // Listen for interest updates on driver socket
  driverSocket.on('user_interest_updated', (data) => {
    console.log('📥 Driver received interest update:', data);
    console.log('✅ User interest system is working!');
  });

  // Test 4: Check API endpoints
  console.log('\n4. Testing API endpoints...');
  
  try {
    const response = await fetch('https://capstone1-60ax.onrender.com/api/stats');
    const stats = await response.json();
    console.log('✅ API is accessible:', stats);
  } catch (error) {
    console.log('❌ API error:', error.message);
  }

  // Cleanup after 10 seconds
  setTimeout(() => {
    console.log('\n🧹 Cleaning up test connections...');
    driverSocket.disconnect();
    userSocket.disconnect();
    console.log('✅ Test completed');
    process.exit(0);
  }, 10000);
}

// Run the test
testSocketConnection().catch(console.error); 