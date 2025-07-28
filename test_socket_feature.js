const io = require('socket.io-client');

// Test the socket connection and interest status update feature
async function testSocketFeature() {
  console.log('Testing socket feature for interest status updates...');
  
  // Connect to the backend socket server
  const socket = io('http://localhost:3001', {
    auth: { 
      token: 'test-token' // This would be a real JWT token in production
    }
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server');
  });

  socket.on('connect_error', (error) => {
    console.log('❌ Connection error:', error.message);
  });

  socket.on('interest_status_updated', (data) => {
    console.log('✅ Received interest status update:', data);
    console.log('   - Interest ID:', data.interestId);
    console.log('   - Status:', data.status);
    console.log('   - User ID:', data.userId);
    console.log('   - Bus ID:', data.busId);
  });

  // Simulate receiving an interest status update
  setTimeout(() => {
    console.log('📡 Simulating interest status update...');
    socket.emit('interest_status_updated', {
      interestId: 'test-interest-id',
      userId: 'test-user-id',
      status: 'confirmed',
      busId: 'test-bus-id',
      busScheduleId: 'test-schedule-id',
      pickupPointId: 'test-pickup-id',
      timestamp: new Date()
    });
  }, 2000);

  // Cleanup after 5 seconds
  setTimeout(() => {
    console.log('🧹 Cleaning up test...');
    socket.disconnect();
    process.exit(0);
  }, 5000);
}

testSocketFeature().catch(console.error); 