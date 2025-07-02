import { Request, Response } from 'express';
export declare const updateBusLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBusLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllBusLocations: (req: Request, res: Response) => Promise<void>;
export declare const getBusLocationHistory: (req: Request, res: Response) => Promise<void>;
export declare const getNearbyBuses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const setDriverOnlineStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=busLocationController.d.ts.map