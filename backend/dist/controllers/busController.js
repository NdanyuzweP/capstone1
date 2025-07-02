"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBus = exports.updateBus = exports.getDriverBus = exports.getBusById = exports.getAllBuses = exports.createBus = void 0;
const Bus_1 = __importDefault(require("../models/Bus"));
const User_1 = __importDefault(require("../models/User"));
const Route_1 = __importDefault(require("../models/Route"));
const createBus = async (req, res) => {
    try {
        const { plateNumber, capacity, driverId, routeId, fare } = req.body;
        const driver = await User_1.default.findById(driverId);
        if (!driver || driver.role !== 'driver') {
            return res.status(400).json({ error: 'Invalid driver' });
        }
        const route = await Route_1.default.findById(routeId);
        if (!route) {
            return res.status(400).json({ error: 'Invalid route' });
        }
        const bus = new Bus_1.default({
            plateNumber,
            capacity,
            driverId,
            routeId,
            fare: fare || route.fare || 400,
        });
        await bus.save();
        const populatedBus = await Bus_1.default.findById(bus._id)
            .populate('driverId', 'name email phone')
            .populate('routeId', 'name description fare');
        res.status(201).json({
            message: 'Bus created successfully',
            bus: populatedBus,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Bus with this plate number already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createBus = createBus;
const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus_1.default.find({ isActive: true })
            .populate('driverId', 'name email phone')
            .populate('routeId', 'name description fare');
        res.json({ buses });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllBuses = getAllBuses;
const getBusById = async (req, res) => {
    try {
        const bus = await Bus_1.default.findById(req.params.id)
            .populate('driverId', 'name email phone')
            .populate('routeId', 'name description fare');
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.json({ bus });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getBusById = getBusById;
const getDriverBus = async (req, res) => {
    try {
        const driverId = req.user.id;
        const bus = await Bus_1.default.findOne({ driverId, isActive: true })
            .populate('driverId', 'name email phone')
            .populate('routeId', 'name description fare estimatedDuration');
        if (!bus) {
            return res.status(404).json({ error: 'No bus assigned to you' });
        }
        res.json({ bus });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getDriverBus = getDriverBus;
const updateBus = async (req, res) => {
    try {
        const { plateNumber, capacity, driverId, routeId, fare } = req.body;
        if (driverId) {
            const driver = await User_1.default.findById(driverId);
            if (!driver || driver.role !== 'driver') {
                return res.status(400).json({ error: 'Invalid driver' });
            }
        }
        if (routeId) {
            const route = await Route_1.default.findById(routeId);
            if (!route) {
                return res.status(400).json({ error: 'Invalid route' });
            }
        }
        const updateData = { plateNumber, capacity, driverId, routeId };
        if (fare !== undefined) {
            updateData.fare = fare;
        }
        const bus = await Bus_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('driverId', 'name email phone')
            .populate('routeId', 'name description fare');
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.json({
            message: 'Bus updated successfully',
            bus,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateBus = updateBus;
const deleteBus = async (req, res) => {
    try {
        const bus = await Bus_1.default.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.json({ message: 'Bus deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteBus = deleteBus;
//# sourceMappingURL=busController.js.map