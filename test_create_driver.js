// Test Create Driver and User Interest Flow
async function testCreateDriverAndInterest() {
  console.log('🧪 Testing Create Driver and User Interest Flow...\n');

  const BASE_URL = 'https://capstone1-60ax.onrender.com/api';

  try {
    // Step 1: Create a test driver
    console.log('1. Creating test driver...');
    const driverSignupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Driver',
        email: 'testdriver@ridra.rw',
        password: 'password123',
        phone: '+250788123457',
        role: 'driver'
      })
    });

    if (!driverSignupResponse.ok) {
      const error = await driverSignupResponse.json();
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
        email: 'testdriver@ridra.rw',
        password: 'password123'
      })
    });

    if (!driverLoginResponse.ok) {
      throw new Error('Failed to login as test driver');
    }

    const driverLoginData = await driverLoginResponse.json();
    const driverToken = driverLoginData.token;
    console.log('✅ Driver logged in successfully');

    // Step 3: Get bus schedules
    console.log('3. Getting bus schedules...');
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
    
    if (scheduledBuses.length === 0) {
      throw new Error('No scheduled buses available');
    }

    const testSchedule = scheduledBuses[0];
    console.log(`✅ Found scheduled bus: ${testSchedule._id}`);

    // Step 4: Check interested users for this schedule
    console.log('4. Checking interested users for this schedule...');
    const interestedUsersResponse = await fetch(`${BASE_URL}/bus-schedules/${testSchedule._id}/interested-users`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!interestedUsersResponse.ok) {
      const error = await interestedUsersResponse.json();
      console.log('❌ Failed to get interested users:', error);
    } else {
      const interestedUsersData = await interestedUsersResponse.json();
      console.log(`✅ Found ${interestedUsersData.interests.length} interested users for this schedule`);
      
      if (interestedUsersData.interests.length > 0) {
        console.log('✅ User interest system is working!');
        console.log('Sample interest:', interestedUsersData.interests[0]);
      } else {
        console.log('⚠️ No interested users found for this schedule');
      }
    }

    // Step 5: Create a test passenger and show interest
    console.log('5. Creating test passenger...');
    const passengerSignupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Passenger 2',
        email: 'testpassenger2@test.com',
        password: 'password123',
        phone: '+250788123458',
        role: 'user'
      })
    });

    if (!passengerSignupResponse.ok) {
      console.log('Passenger might already exist, trying login...');
    }

    // Step 6: Login as the test passenger
    console.log('6. Logging in as test passenger...');
    const passengerLoginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testpassenger2@test.com',
        password: 'password123'
      })
    });

    if (!passengerLoginResponse.ok) {
      throw new Error('Failed to login as test passenger');
    }

    const passengerLoginData = await passengerLoginResponse.json();
    const passengerToken = passengerLoginData.token;
    console.log('✅ Passenger logged in successfully');

    // Step 7: Get pickup points
    console.log('7. Getting pickup points...');
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

    // Step 8: Show interest in the bus
    console.log('8. Showing interest in bus...');
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

    // Step 9: Check interested users again as driver
    console.log('9. Checking interested users again as driver...');
    const interestedUsersResponse2 = await fetch(`${BASE_URL}/bus-schedules/${testSchedule._id}/interested-users`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!interestedUsersResponse2.ok) {
      const error = await interestedUsersResponse2.json();
      console.log('❌ Failed to get interested users:', error);
    } else {
      const interestedUsersData2 = await interestedUsersResponse2.json();
      console.log(`✅ Found ${interestedUsersData2.interests.length} interested users for this schedule`);
      
      if (interestedUsersData2.interests.length > 0) {
        console.log('✅ User interest system is working!');
        console.log('Sample interest:', interestedUsersData2.interests[0]);
      } else {
        console.log('⚠️ No interested users found for this schedule');
      }
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCreateDriverAndInterest(); 