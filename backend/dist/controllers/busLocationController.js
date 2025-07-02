"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDriverOnlineStatus = exports.getNearbyBuses = exports.getBusLocationHistory = exports.getAllBusLocations = exports.getBusLocation = exports.updateBusLocation = void 0;
const Bus_1 = __importDefault(require("../models/Bus"));
const BusLocationHistory_1 = __importDefault(require("../models/BusLocationHistory"));
const updateBusLocation = async (req, res) => {
    try {
        const { busId, latitude, longitude, speed = 0, heading = 0, accuracy = 0 } = req.body;
        const driverId = req.user.id;
        const bus = await Bus_1.default.findOne({ _id: busId, driverId });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found or not assigned to you' });
        }
        const updatedBus = await Bus_1.default.findByIdAndUpdate(busId, {
            currentLocation: {
                latitude,
                longitude,
                lastUpdated: new Date(),
                speed,
                heading,
            },
            isOnline: true,
        }, { new: true }).populate('driverId', 'name email phone')
            .populate('routeId', 'name description');
        const locationHistory = new BusLocationHistory_1.default({
            busId,
            location: { latitude, longitude },
            speed,
            heading,
            accuracy,
        });
        await locationHistory.save();
        res.json({
            message: 'Location updated successfully',
            bus: updatedBus,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateBusLocation = updateBusLocation;
const getBusLocation = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus_1.default.findById(busId)
            .populate('driverId', 'name email phone')
            .populate('routeId', 'name description');
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        const isLocationRecent = bus.currentLocation.lastUpdated &&
            (new Date().getTime() - bus.currentLocation.lastUpdated.getTime()) < 5 * 60 * 1000;
        res.json({
            bus: {
                id: bus._id,
                plateNumber: bus.plateNumber,
                driver: bus.driverId,
                route: bus.routeId,
                currentLocation: bus.currentLocation,
                isOnline: bus.isOnline && isLocationRecent,
                lastSeen: bus.currentLocation.lastUpdated,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getBusLocation = getBusLocation;
const getAllBusLocations = async (req, res) => {
    try {
        const { routeId, isOnline } = req.query;
        let query = { isActive: true };
        if (routeId)
            query.routeId = routeId;
        const buses = await Bus_1.default.find(query)
            .populate('driverId', 'name email phone')
            .populate('routeId', 'name description');
        const busLocations = buses.map(bus => {
            const isLocationRecent = bus.currentLocation.lastUpdated &&
                (new Date().getTime() - bus.currentLocation.lastUpdated.getTime()) < 5 * 60 * 1000;
            const busOnline = bus.isOnline && isLocationRecent;
            return {
                id: bus._id,
                plateNumber: bus.plateNumber,
                driver: bus.driverId,
                route: bus.routeId,
                currentLocation: bus.currentLocation,
                isOnline: busOnline,
                lastSeen: bus.currentLocation.lastUpdated,
            };
        }).filter(bus => {
            if (isOnline === 'true')
                return bus.isOnline;
            if (isOnline === 'false')
                return !bus.isOnline;
            return true;
        });
        res.json({ buses: busLocations });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllBusLocations = getAllBusLocations;
const getBusLocationHistory = async (req, res) => {
    try {
        const { busId } = req.params;
        const { hours = 1 } = req.query;
        const timeRange = new Date();
        timeRange.setHours(timeRange.getHours() - Number(hours));
        const locationHistory = await BusLocationHistory_1.default.find({
            busId,
            timestamp: { $gte: timeRange },
        }).sort({ timestamp: -1 });
        res.json({ locationHistory });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getBusLocationHistory = getBusLocationHistory;
const getNearbyBuses = async (req, res) => {
    try {
        const { latitude, longitude, radius = 5 } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
        const radiusInDegrees = Number(radius) / 111;
        const buses = await Bus_1.default.find({
            isActive: true,
            'currentLocation.latitude': {
                $gte: Number(latitude) - radiusInDegrees,
                $lte: Number(latitude) + radiusInDegrees,
            },
            'currentLocation.longitude': {
                $gte: Number(longitude) - radiusInDegrees,
                $lte: Number(longitude) + radiusInDegrees,
            },
            'currentLocation.lastUpdated': {
                $gte: new Date(Date.now() - 5 * 60 * 1000),
            },
        }).populate('driverId', 'name email phone')
            .populate('routeId', 'name description');
        const nearbyBuses = buses.map(bus => {
            const distance = calculateDistance(Number(latitude), Number(longitude), bus.currentLocation.latitude, bus.currentLocation.longitude);
            return {
                id: bus._id,
                plateNumber: bus.plateNumber,
                driver: bus.driverId,
                route: bus.routeId,
                currentLocation: bus.currentLocation,
                distance: Math.round(distance * 100) / 100,
                isOnline: true,
            };
        }).filter(bus => bus.distance <= Number(radius))
            .sort((a, b) => a.distance - b.distance);
        res.json({ buses: nearbyBuses });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getNearbyBuses = getNearbyBuses;
const setDriverOnlineStatus = async (req, res) => {
    try {
        const { busId, isOnline } = req.body;
        const driverId = req.user.id;
        const bus = await Bus_1.default.findOne({ _id: busId, driverId });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found or not assigned to you' });
        }
        await Bus_1.default.findByIdAndUpdate(busId, { isOnline });
        res.json({
            message: `Driver status updated to ${isOnline ? 'online' : 'offline'}`,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.setDriverOnlineStatus = setDriverOnlineStatus;
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
//# sourceMappingURL=busLocationController.js.map