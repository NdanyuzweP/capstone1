import { Request, Response } from 'express';
export declare const createUserInterest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserInterests: (req: Request, res: Response) => Promise<void>;
export declare const updateUserInterest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUserInterest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userInterestController.d.ts.map