// Test Driver View of Interested Users
async function testDriverView() {
  console.log('🧪 Testing Driver View of Interested Users...\n');

  const BASE_URL = 'https://capstone1-60ax.onrender.com/api';

  try {
    // Step 1: Try to login as different drivers
    console.log('1. Trying to login as different drivers...');
    
    const drivers = [
      'driver1@ridra.rw',
      'driver2@ridra.rw', 
      'driver3@ridra.rw',
      'driver4@ridra.rw',
      'driver5@ridra.rw'
    ];

    let driverToken = null;
    let driverEmail = null;

    for (const email of drivers) {
      try {
        console.log(`Trying ${email}...`);
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: 'password123'
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          driverToken = loginData.token;
          driverEmail = email;
          console.log(`✅ Successfully logged in as ${email}`);
          break;
        }
      } catch (error) {
        console.log(`❌ Failed to login as ${email}`);
      }
    }

    if (!driverToken) {
      throw new Error('Could not login as any driver');
    }

    // Step 2: Get the driver's bus
    console.log('2. Getting driver\'s bus...');
    const busResponse = await fetch(`${BASE_URL}/buses`, {
      headers: {
        'Authorization': `Bearer ${driverToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!busResponse.ok) {
      throw new Error('Failed to get buses');
    }

    const busData = await busResponse.json();
    const driverBus = busData.buses.find(bus => {
      if (typeof bus.driverId === 'string') return bus.driverId === driverEmail;
      if (bus.driverId && bus.driverId.email) return bus.driverId.email === driverEmail;
      return false;
    });

    if (!driverBus) {
      console.log('⚠️ Driver has no assigned bus, checking all schedules...');
    } else {
      console.log(`✅ Driver has bus: ${driverBus.plateNumber}`);
    }

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
    console.log(`✅ Found ${scheduledBuses.length} scheduled buses`);

    // Step 4: Check interested users for each schedule
    console.log('4. Checking interested users for each schedule...');
    
    for (const schedule of scheduledBuses.slice(0, 3)) { // Check first 3 schedules
      console.log(`\nChecking schedule: ${schedule._id}`);
      
      const interestedUsersResponse = await fetch(`${BASE_URL}/bus-schedules/${schedule._id}/interested-users`, {
        headers: {
          'Authorization': `Bearer ${driverToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (interestedUsersResponse.ok) {
        const interestedUsersData = await interestedUsersResponse.json();
        console.log(`✅ Found ${interestedUsersData.interests.length} interested users for this schedule`);
        
        if (interestedUsersData.interests.length > 0) {
          console.log('✅ User interest system is working!');
          console.log('Sample interest:', interestedUsersData.interests[0]);
          break;
        }
      } else {
        const error = await interestedUsersResponse.json();
        console.log(`❌ Failed to get interested users:`, error);
      }
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDriverView(); 