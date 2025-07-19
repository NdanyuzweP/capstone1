import mongoose, { Schema } from 'mongoose';
import { IBusSchedule } from '../types';

const busScheduleSchema = new Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
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