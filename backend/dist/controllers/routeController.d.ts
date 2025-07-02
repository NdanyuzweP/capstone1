import { Request, Response } from 'express';
export declare const createRoute: (req: Request, res: Response) => Promise<void>;
export declare const getAllRoutes: (req: Request, res: Response) => Promise<void>;
export declare const getRouteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRoute: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRoute: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=routeController.d.ts.map