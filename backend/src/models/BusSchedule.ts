import mongoose, { Schema } from 'mongoose';
import { IBusSchedule } from '../types';

const busScheduleSchema = new Schema<IBusSchedule>(
  {
    busId: {
      type: String,
      ref: 'Bus',
      required: true,
    },
    routeId: {
      type: String,
      ref: 'Route',
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    estimatedArrivalTimes: [
      {
        pickupPointId: {
          type: String,
          ref: 'PickupPoint',
          required: true,
        },
        estimatedTime: {
          type: Date,
          required: true,
        },
        actualTime: {
          type: Date,
        },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'in-transit', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBusSchedule>('BusSchedule', busScheduleSchema);