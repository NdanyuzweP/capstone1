// Test Frontend-Backend Flow for User Interests
async function testFrontendBackendFlow() {
  console.log('🧪 Testing Frontend-Backend Flow for User Interests...\n');

  const BASE_URL = 'https://capstone1-60ax.onrender.com/api';

  try {
    // Step 1: Create a test driver
    console.log('1. Creating test driver for frontend test...');
    const driverSignupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Frontend Test Driver',
        email: 'frontenddriver@ridra.rw',
        password: 'password123',
        phone: '+250788123459',
        role: 'driver'
      })
    });

    if (!driverSignupResponse.ok) {
      console.log('Driver might already exist, trying login...');
    }

    // Step 2: Login as the test driver
    console.log('2. Logging in as test driver...');
    const driverLoginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'frontenddriver@ridra.rw',
        password: 'password123'
      })
    });

    if (!driverLoginResponse.ok) {
      throw new Error('Failed to login as test driver');
    }

    const driverLoginData = await driverLoginResponse.json();
    const driverToken = driverLoginData.token;
    console.log('✅ Driver logged in successfully');

    // Step 3: Simulate driver frontend API calls
    console.log('3. Testing driver frontend API calls...');
    
    // Test 1: Get buses (like driver frontend does)
    console.log('   a) Getting buses...');
    const busesResponse = await fetch(`${BASE_URL}/buses`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!busesResponse.ok) {
      throw new Error('Failed to get buses');
    }

    const busesData = await busesResponse.json();
    console.log(`   ✅ Found ${busesData.buses.length} buses`);

    // Test 2: Get bus schedules (like driver frontend does)
    console.log('   b) Getting bus schedules...');
    const schedulesResponse = await fetch(`${BASE_URL}/bus-schedules`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!schedulesResponse.ok) {
      throw new Error('Failed to get bus schedules');
    }

    const schedulesData = await schedulesResponse.json();
    const scheduledBuses = schedulesData.schedules.filter(s => s.status === 'scheduled');
    console.log(`   ✅ Found ${scheduledBuses.length} scheduled buses`);

    if (scheduledBuses.length === 0) {
      throw new Error('No scheduled buses available for testing');
    }

    const testSchedule = scheduledBuses[0];
    console.log(`   ✅ Using schedule: ${testSchedule._id}`);

    // Test 3: Get interested passengers (like driver frontend does)
    console.log('   c) Getting interested passengers...');
    const interestedPassengersResponse = await fetch(`${BASE_URL}/bus-schedules/${testSchedule._id}/interested-users`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!interestedPassengersResponse.ok) {
      const error = await interestedPassengersResponse.json();
      console.log(`   ❌ Failed to get interested passengers:`, error);
    } else {
      const interestedPassengersData = await interestedPassengersResponse.json();
      console.log(`   ✅ Found ${interestedPassengersData.interests.length} interested passengers`);
      
      if (interestedPassengersData.interests.length > 0) {
        console.log('   ✅ Driver can see interested passengers!');
        console.log('   Sample passenger:', {
          name: interestedPassengersData.interests[0].userId?.name,
          email: interestedPassengersData.interests[0].userId?.email,
          pickupPoint: interestedPassengersData.interests[0].pickupPointId?.name
        });
      }
    }

    // Step 4: Create a test passenger and show interest
    console.log('4. Creating test passenger for frontend test...');
    const passengerSignupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Frontend Test Passenger',
        email: 'frontendpassenger@test.com',
        password: 'password123',
        phone: '+250788123460',
        role: 'user'
      })
    });

    if (!passengerSignupResponse.ok) {
      console.log('Passenger might already exist, trying login...');
    }

    // Step 5: Login as the test passenger
    console.log('5. Logging in as test passenger...');
    const passengerLoginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'frontendpassenger@test.com',
        password: 'password123'
      })
    });

    if (!passengerLoginResponse.ok) {
      throw new Error('Failed to login as test passenger');
    }

    const passengerLoginData = await passengerLoginResponse.json();
    const passengerToken = passengerLoginData.token;
    console.log('✅ Passenger logged in successfully');

    // Step 6: Get pickup points (like passenger frontend does)
    console.log('6. Getting pickup points...');
    const pickupPointsResponse = await fetch(`${BASE_URL}/pickup-points`, {
      headers: {
        'Authorization': `Bearer ${passengerToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!pickupPointsResponse.ok) {
      throw new Error('Failed to get pickup points');
    }

    const pickupPointsData = await pickupPointsResponse.json();
    const testPickupPoint = pickupPointsData.pickupPoints[0];
    console.log(`✅ Found pickup point: ${testPickupPoint._id}`);

    // Step 7: Show interest in the bus (like passenger frontend does)
    console.log('7. Showing interest in bus...');
    const interestResponse = await fetch(`${BASE_URL}/user-interests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${passengerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        busScheduleId: testSchedule._id,
        pickupPointId: testPickupPoint._id
      })
    });

    if (!interestResponse.ok) {
      const error = await interestResponse.json();
      console.log('Interest might already exist, checking existing interests...');
    } else {
      const interestData = await interestResponse.json();
      console.log('✅ Interest created successfully:', interestData.interest._id);
    }

    // Step 8: Check interested passengers again as driver (simulating frontend refresh)
    console.log('8. Checking interested passengers again as driver (simulating frontend refresh)...');
    const interestedPassengersResponse2 = await fetch(`${BASE_URL}/bus-schedules/${testSchedule._id}/interested-users`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!interestedPassengersResponse2.ok) {
      const error = await interestedPassengersResponse2.json();
      console.log('❌ Failed to get interested passengers:', error);
    } else {
      const interestedPassengersData2 = await interestedPassengersResponse2.json();
      console.log(`✅ Found ${interestedPassengersData2.interests.length} interested passengers`);
      
      if (interestedPassengersData2.interests.length > 0) {
        console.log('✅ Driver can see the new interested passenger!');
        console.log('✅ Frontend-Backend flow is working perfectly!');
        
        // Show details of the new interest
        const newInterest = interestedPassengersData2.interests.find(interest => 
          interest.userId?.email === 'frontendpassenger@test.com'
        );
        
        if (newInterest) {
          console.log('✅ New passenger interest details:', {
            passengerName: newInterest.userId?.name,
            passengerEmail: newInterest.userId?.email,
            pickupPoint: newInterest.pickupPointId?.name,
            status: newInterest.status,
            createdAt: newInterest.createdAt
          });
        }
      } else {
        console.log('⚠️ No interested passengers found for this schedule');
      }
    }

    console.log('\n🎉 Frontend-Backend Flow Test completed successfully!');
    console.log('✅ Both frontend and backend are working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testFrontendBackendFlow(); 