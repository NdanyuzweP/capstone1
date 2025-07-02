import { Request, Response } from 'express';
export declare const createBusSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllBusSchedules: (req: Request, res: Response) => Promise<void>;
export declare const getBusScheduleById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBusSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateArrivalTime: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getInterestedUsers: (req: Request, res: Response) => Promise<void>;
export declare const deleteBusSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=busScheduleController.d.ts.map