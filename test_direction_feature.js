const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testDirectionFeature() {
  try {
    console.log('🧪 Testing Direction Feature...\n');

    // Test 1: Get nearby buses and check for direction information
    console.log('1. Testing nearby buses endpoint...');
    const nearbyResponse = await axios.get(`${API_BASE_URL}/bus-locations/nearby`, {
      params: {
        latitude: -1.9441, // Kimironko coordinates
        longitude: 30.1056,
        radius: 5
      }
    });

    console.log(`Found ${nearbyResponse.data.buses.length} nearby buses`);
    
    // Check if buses have direction information
    const busesWithDirection = nearbyResponse.data.buses.filter(bus => 
      bus.currentDirection && bus.directionDisplay
    );
    
    console.log(`${busesWithDirection.length} buses have direction information`);
    
    if (busesWithDirection.length > 0) {
      console.log('\nSample bus with direction:');
      const sampleBus = busesWithDirection[0];
      console.log(`- Route: ${sampleBus.route?.name}`);
      console.log(`- Direction: ${sampleBus.currentDirection}`);
      console.log(`- Display: ${sampleBus.directionDisplay}`);
      console.log(`- Origin: ${sampleBus.routeOrigin}`);
      console.log(`- Destination: ${sampleBus.routeDestination}`);
    }

    // Test 2: Get all buses and check direction distribution
    console.log('\n2. Testing all buses endpoint...');
    const allBusesResponse = await axios.get(`${API_BASE_URL}/bus-locations`);
    
    const outboundBuses = allBusesResponse.data.buses.filter(bus => bus.currentDirection === 'outbound');
    const inboundBuses = allBusesResponse.data.buses.filter(bus => bus.currentDirection === 'inbound');
    
    console.log(`Total buses: ${allBusesResponse.data.buses.length}`);
    console.log(`Outbound buses: ${outboundBuses.length}`);
    console.log(`Inbound buses: ${inboundBuses.length}`);

    // Test 3: Check route information
    console.log('\n3. Testing routes endpoint...');
    const routesResponse = await axios.get(`${API_BASE_URL}/routes`);
    
    console.log(`Total routes: ${routesResponse.data.routes.length}`);
    
    const bidirectionalRoutes = routesResponse.data.routes.filter(route => route.isBidirectional);
    console.log(`Bidirectional routes: ${bidirectionalRoutes.length}`);
    
    if (bidirectionalRoutes.length > 0) {
      console.log('\nSample bidirectional route:');
      const sampleRoute = bidirectionalRoutes[0];
      console.log(`- Name: ${sampleRoute.name}`);
      console.log(`- Origin: ${sampleRoute.origin}`);
      console.log(`- Destination: ${sampleRoute.destination}`);
      console.log(`- Bidirectional: ${sampleRoute.isBidirectional}`);
    }

    console.log('\n✅ Direction feature test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing direction feature:', error.response?.data || error.message);
  }
}

testDirectionFeature(); 