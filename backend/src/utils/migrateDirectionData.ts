import Route from '../models/Route';
import Bus from '../models/Bus';

export const migrateDirectionData = async () => {
  try {
    console.log('🔄 Starting direction data migration...');

    // Update routes with direction information
    const routes = await Route.find({});
    console.log(`Found ${routes.length} routes to migrate`);

    for (const route of routes) {
      // Parse the description to extract origin and destination
      const description = route.description || '';
      const parts = description.split(' - ');
      
      if (parts.length >= 2) {
        const origin = parts[0].trim();
        const destination = parts[1].trim();
        
        // Update route with direction information
        await Route.findByIdAndUpdate(route._id, {
          origin,
          destination,
          isBidirectional: true,
        });
        
        console.log(`Updated route ${route.name}: ${origin} → ${destination}`);
      } else {
        // For routes without clear origin-destination format, use defaults
        await Route.findByIdAndUpdate(route._id, {
          origin: 'Kimironko',
          destination: 'Destination',
          isBidirectional: true,
        });
        
        console.log(`Updated route ${route.name} with default direction info`);
      }
    }

    // Update buses with random direction
    const buses = await Bus.find({});
    console.log(`Found ${buses.length} buses to migrate`);

    for (const bus of buses) {
      // Assign random direction if not already set
      if (!bus.currentDirection) {
        const currentDirection = Math.random() > 0.5 ? 'outbound' : 'inbound';
        await Bus.findByIdAndUpdate(bus._id, {
          currentDirection,
        });
        
        console.log(`Updated bus ${bus.plateNumber} with direction: ${currentDirection}`);
      }
    }

    console.log('✅ Direction data migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during direction data migration:', error);
    throw error;
  }
}; 