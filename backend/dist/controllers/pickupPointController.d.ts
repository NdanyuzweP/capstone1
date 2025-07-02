import { Request, Response } from 'express';
export declare const createPickupPoint: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllPickupPoints: (req: Request, res: Response) => Promise<void>;
export declare const getPickupPointById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePickupPoint: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePickupPoint: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=pickupPointController.d.ts.map