"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusSchedule = exports.updateUserInterestStatus = exports.getInterestedUsers = exports.updateArrivalTime = exports.updateBusSchedule = exports.getBusScheduleById = exports.getAllBusSchedules = exports.createBusSchedule = void 0;
const BusSchedule_1 = __importDefault(require("../models/BusSchedule"));
const Bus_1 = __importDefault(require("../models/Bus"));
const Route_1 = __importDefault(require("../models/Route"));
const UserInterest_1 = __importDefault(require("../models/UserInterest"));
const createBusSchedule = async (req, res) => {
    try {
        const { busId, routeId, departureTime, estimatedArrivalTimes } = req.body;
        const bus = await Bus_1.default.findById(busId);
        if (!bus) {
            return res.status(400).json({ error: 'Invalid bus' });
        }
        const route = await Route_1.default.findById(routeId);
        if (!route) {
            return res.status(400).json({ error: 'Invalid route' });
        }
        const busSchedule = new BusSchedule_1.default({
            busId,
            routeId,
            departureTime,
            estimatedArrivalTimes,
        });
        await busSchedule.save();
        const populatedSchedule = await BusSchedule_1.default.findById(busSchedule._id)
            .populate('busId', 'plateNumber capacity')
            .populate('routeId', 'name description')
            .populate('estimatedArrivalTimes.pickupPointId', 'name description');
        res.status(201).json({
            message: 'Bus schedule created successfully',
            schedule: populatedSchedule,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createBusSchedule = createBusSchedule;
const getAllBusSchedules = async (req, res) => {
    try {
        const { status, routeId, date } = req.query;
        let query = {};
        if (status)
            query.status = status;
        if (routeId)
            query.routeId = routeId;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            query.departureTime = { $gte: startDate, $lt: endDate };
        }
        const schedules = await BusSchedule_1.default.find(query)
            .populate('busId', 'plateNumber capacity')
            .populate('routeId', 'name description')
            .populate('estimatedArrivalTimes.pickupPointId', 'name description')
            .sort({ departureTime: 1 });
        res.json({ schedules });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};
exports.getAllBusSchedules = getAllBusSchedules;
const getBusScheduleById = async (req, res) => {
    try {
        const schedule = await BusSchedule_1.default.findById(req.params.id)
            .populate('busId', 'plateNumber capacity')
            .populate('routeId', 'name description')
            .populate('estimatedArrivalTimes.pickupPointId', 'name description');
        if (!schedule) {
            return res.status(404).json({ error: 'Bus schedule not found' });
        }
        res.json({ schedule });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getBusScheduleById = getBusScheduleById;
const updateBusSchedule = async (req, res) => {
    try {
        const { departureTime, estimatedArrivalTimes, status } = req.body;
        const schedule = await BusSchedule_1.default.findByIdAndUpdate(req.params.id, { departureTime, estimatedArrivalTimes, status }, { new: true }).populate('busId', 'plateNumber capacity')
            .populate('routeId', 'name description')
            .populate('estimatedArrivalTimes.pickupPointId', 'name description');
        if (!schedule) {
            return res.status(404).json({ error: 'Bus schedule not found' });
        }
        res.json({
            message: 'Bus schedule updated successfully',
            schedule,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateBusSchedule = updateBusSchedule;
const updateArrivalTime = async (req, res) => {
    try {
        const { pickupPointId, actualTime } = req.body;
        const schedule = await BusSchedule_1.default.findOneAndUpdate({
            _id: req.params.id,
            'estimatedArrivalTimes.pickupPointId': pickupPointId
        }, {
            $set: { 'estimatedArrivalTimes.$.actualTime': actualTime }
        }, { new: true }).populate('busId', 'plateNumber capacity')
            .populate('routeId', 'name description')
            .populate('estimatedArrivalTimes.pickupPointId', 'name description');
        if (!schedule) {
            return res.status(404).json({ error: 'Bus schedule or pickup point not found' });
        }
        res.json({
            message: 'Arrival time updated successfully',
            schedule,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateArrivalTime = updateArrivalTime;
const getInterestedUsers = async (req, res) => {
    try {
        const interests = await UserInterest_1.default.find({
            busScheduleId: req.params.id,
            status: { $in: ['interested', 'confirmed'] }
        }).populate('userId', 'name email phone')
            .populate('pickupPointId', 'name description');
        res.json({ interests });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getInterestedUsers = getInterestedUsers;
const updateUserInterestStatus = async (req, res) => {
    try {
        const { interestId } = req.params;
        const { status } = req.body;
        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be "confirmed" or "cancelled"' });
        }
        const interest = await UserInterest_1.default.findById(interestId)
            .populate({
            path: 'busScheduleId',
            populate: {
                path: 'busId',
                select: 'driverId'
            }
        });
        if (!interest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
        const busSchedule = interest.busScheduleId;
        const bus = busSchedule?.busId;
        const driverId = req.user.id;
        console.log('Authorization check:', {
            interestId,
            driverId,
            busDriverId: bus?.driverId,
            busDriverIdString: bus?.driverId?.toString(),
            busScheduleId: busSchedule?._id,
            busId: bus?._id,
            isMatch: bus?.driverId?.toString() === driverId
        });
        const busDriverId = bus?.driverId;
        const isAuthorized = busDriverId && (busDriverId.toString() === driverId ||
            busDriverId === driverId ||
            (typeof busDriverId === 'object' && busDriverId._id?.toString() === driverId) ||
            (typeof busDriverId === 'object' && busDriverId.toString() === driverId));
        if (!bus || !isAuthorized) {
            console.log('Authorization failed:', {
                driverId,
                busDriverId: busDriverId?.toString(),
                busId: bus?._id,
                isAuthorized,
                busDriverIdType: typeof busDriverId,
                driverIdType: typeof driverId
            });
            return res.status(403).json({
                error: 'Not authorized to manage this interest',
                debug: {
                    driverId,
                    busDriverId: busDriverId?.toString(),
                    busId: bus?._id,
                    driverIdType: typeof driverId,
                    busDriverIdType: typeof busDriverId
                }
            });
        }
        const updatedInterest = await UserInterest_1.default.findByIdAndUpdate(interestId, { status }, { new: true }).populate('userId', 'name email phone')
            .populate('pickupPointId', 'name description')
            .populate('busScheduleId', 'departureTime status');
        if (!updatedInterest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
        res.json({
            message: `Interest ${status} successfully`,
            interest: updatedInterest,
        });
    }
    catch (error) {
        console.error('Error updating user interest status:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUserInterestStatus = updateUserInterestStatus;
const deleteBusSchedule = async (req, res) => {
    try {
        const schedule = await BusSchedule_1.default.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
        if (!schedule) {
            return res.status(404).json({ error: 'Bus schedule not found' });
        }
        res.json({ message: 'Bus schedule cancelled successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteBusSchedule = deleteBusSchedule;
