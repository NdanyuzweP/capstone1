import { Request, Response } from 'express';
export declare const createBus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllBuses: (req: Request, res: Response) => Promise<void>;
export declare const getBusById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDriverBus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=busController.d.ts.map