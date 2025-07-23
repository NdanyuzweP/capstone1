import { Request, Response } from 'express';
import BusSchedule from '../models/BusSchedule';
import Bus from '../models/Bus';
import Route from '../models/Route';
import UserInterest from '../models/UserInterest';

export const createBusSchedule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { busId, routeId, departureTime, estimatedArrivalTimes } = req.body;

    // Verify bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(400).json({ error: 'Invalid bus' });
    }

    // Verify route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(400).json({ error: 'Invalid route' });
    }

    const busSchedule = new BusSchedule({
      busId,
      routeId,
      departureTime,
      estimatedArrivalTimes,
    });

    await busSchedule.save();

    const populatedSchedule = await BusSchedule.findById(busSchedule._id)
      .populate('busId', 'plateNumber capacity')
      .populate('routeId', 'name description')
      .populate('estimatedArrivalTimes.pickupPointId', 'name description');

    res.status(201).json({
      message: 'Bus schedule created successfully',
      schedule: populatedSchedule,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllBusSchedules = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, routeId, date } = req.query;
    
    let query: any = {};
    if (status) query.status = status;
    if (routeId) query.routeId = routeId;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.departureTime = { $gte: startDate, $lt: endDate };
    }

    const schedules = await BusSchedule.find(query)
      .populate('busId', 'plateNumber capacity')
      .populate('routeId', 'name description')
      .populate('estimatedArrivalTimes.pickupPointId', 'name description')
      .sort({ departureTime: 1 });

    res.json({ schedules });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getBusScheduleById = async (req: Request, res: Response): Promise<any> => {
  try {
    const schedule = await BusSchedule.findById(req.params.id)
      .populate('busId', 'plateNumber capacity')
      .populate('routeId', 'name description')
      .populate('estimatedArrivalTimes.pickupPointId', 'name description');

    if (!schedule) {
      return res.status(404).json({ error: 'Bus schedule not found' });
    }

    res.json({ schedule });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateBusSchedule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { departureTime, estimatedArrivalTimes, status } = req.body;

    const schedule = await BusSchedule.findByIdAndUpdate(
      req.params.id,
      { departureTime, estimatedArrivalTimes, status },
      { new: true }
    ).populate('busId', 'plateNumber capacity')
     .populate('routeId', 'name description')
     .populate('estimatedArrivalTimes.pickupPointId', 'name description');

    if (!schedule) {
      return res.status(404).json({ error: 'Bus schedule not found' });
    }

    res.json({
      message: 'Bus schedule updated successfully',
      schedule,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateArrivalTime = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pickupPointId, actualTime } = req.body;

    const schedule = await BusSchedule.findOneAndUpdate(
      { 
        _id: req.params.id,
        'estimatedArrivalTimes.pickupPointId': pickupPointId 
      },
      { 
        $set: { 'estimatedArrivalTimes.$.actualTime': actualTime }
      },
      { new: true }
    ).populate('busId', 'plateNumber capacity')
     .populate('routeId', 'name description')
     .populate('estimatedArrivalTimes.pickupPointId', 'name description');

    if (!schedule) {
      return res.status(404).json({ error: 'Bus schedule or pickup point not found' });
    }

    res.json({
      message: 'Arrival time updated successfully',
      schedule,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getInterestedUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const interests = await UserInterest.find({
      busScheduleId: req.params.id,
      status: { $in: ['interested', 'confirmed'] }
    }).populate('userId', 'name email phone')
      .populate('pickupPointId', 'name description');

    res.json({ interests });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserInterestStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status } = req.body;
    const { interestId } = req.params;
    const driverId = (req as any).user.id;

    console.log('updateUserInterestStatus called with:', {
      interestId,
      status,
      driverId,
      userRole: (req as any).user.role,
      headers: req.headers
    });

    const interest = await UserInterest.findById(interestId)
      .populate({
        path: 'busScheduleId',
        populate: {
          path: 'busId',
          select: 'driverId plateNumber'
        }
      });

    if (!interest) {
      console.log('Interest not found for ID:', interestId);
      return res.status(404).json({ error: 'Interest not found' });
    }

    // Check if the current user is the driver of this bus
    const busSchedule = interest.busScheduleId as any;
    const bus = busSchedule?.busId;

    console.log('Authorization check:', {
      interestId,
      driverId,
      busDriverId: bus?.driverId,
      busDriverIdString: bus?.driverId?.toString(),
      busScheduleId: busSchedule?._id,
      busId: bus?._id,
      isMatch: bus?.driverId?.toString() === driverId
    });

    // More flexible authorization check to handle different ID formats
    const busDriverId = bus?.driverId;
    const isAuthorized = busDriverId && (
      busDriverId.toString() === driverId ||
      busDriverId === driverId ||
      (typeof busDriverId === 'object' && busDriverId._id?.toString() === driverId) ||
      (typeof busDriverId === 'object' && busDriverId.toString() === driverId)
    );

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

    // Update the interest status
    const updatedInterest = await UserInterest.findByIdAndUpdate(
      interestId,
      { status },
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('pickupPointId', 'name description')
     .populate('busScheduleId', 'departureTime status');

    if (!updatedInterest) {
      return res.status(404).json({ error: 'Interest not found' });
    }

    console.log('Interest updated successfully:', {
      interestId,
      newStatus: status,
      driverId
    });

    res.json({
      message: `Interest ${status} successfully`,
      interest: updatedInterest,
    });
  } catch (error) {
    console.error('Error updating user interest status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteBusSchedule = async (req: Request, res: Response): Promise<any> => {
  try {
    const schedule = await BusSchedule.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Bus schedule not found' });
    }

    res.json({ message: 'Bus schedule cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

