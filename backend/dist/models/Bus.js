"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const busSchema = new mongoose_1.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    driverId: {
        type: String,
        ref: 'User',
        required: true,
    },
    routeId: {
        type: String,
        ref: 'Route',
        required: true,
    },
    currentLocation: {
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
        lastUpdated: {
            type: Date,
            default: null,
        },
        speed: {
            type: Number,
            default: 0,
        },
        heading: {
            type: Number,
            default: 0,
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    currentDirection: {
        type: String,
        enum: ['outbound', 'inbound'],
        default: null,
    },
}, {
    timestamps: true,
});
busSchema.index({ 'currentLocation.latitude': 1, 'currentLocation.longitude': 1 });
exports.default = mongoose_1.default.model('Bus', busSchema);
