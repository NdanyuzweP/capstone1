// Test User Interest Flow
async function testUserInterestFlow() {
  console.log('🧪 Testing User Interest Flow...\n');

  const BASE_URL = 'https://capstone1-60ax.onrender.com/api';

  try {
    // Step 1: Create a test user (passenger)
    console.log('1. Creating test user...');
    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Passenger',
        email: 'testpassenger@test.com',
        password: 'password123',
        phone: '+250788123456',
        role: 'user'
      })
    });

    if (!signupResponse.ok) {
      const error = await signupResponse.json();
      console.log('User might already exist, trying login...');
    }

    // Step 2: Login as the test user
    console.log('2. Logging in as test user...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testpassenger@test.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Failed to login as test user');
    }

    const loginData = await loginResponse.json();
    const userToken = loginData.token;
    console.log('✅ User logged in successfully');

    // Step 3: Get available bus schedules
    console.log('3. Getting bus schedules...');
    const schedulesResponse = await fetch(`${BASE_URL}/bus-schedules`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
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

    // Step 4: Get pickup points for this schedule
    console.log('4. Getting pickup points...');
    const pickupPointsResponse = await fetch(`${BASE_URL}/pickup-points`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!pickupPointsResponse.ok) {
      throw new Error('Failed to get pickup points');
    }

    const pickupPointsData = await pickupPointsResponse.json();
    const testPickupPoint = pickupPointsData.pickupPoints[0];
    console.log(`✅ Found pickup point: ${testPickupPoint._id}`);

    // Step 5: Show interest in the bus
    console.log('5. Showing interest in bus...');
    const interestResponse = await fetch(`${BASE_URL}/user-interests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
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

    // Step 6: Get user's interests
    console.log('6. Getting user interests...');
    const userInterestsResponse = await fetch(`${BASE_URL}/user-interests`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!userInterestsResponse.ok) {
      throw new Error('Failed to get user interests');
    }

    const userInterestsData = await userInterestsResponse.json();
    console.log(`✅ User has ${userInterestsData.interests.length} interests`);

    // Step 7: Login as a driver to check interested users
    console.log('7. Logging in as driver...');
    const driverLoginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'driver1@ridra.rw',
        password: 'password123'
      })
    });

    if (!driverLoginResponse.ok) {
      throw new Error('Failed to login as driver');
    }

    const driverLoginData = await driverLoginResponse.json();
    const driverToken = driverLoginData.token;
    console.log('✅ Driver logged in successfully');

    // Step 8: Get interested users for the schedule
    console.log('8. Getting interested users for schedule...');
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

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUserInterestFlow(); 