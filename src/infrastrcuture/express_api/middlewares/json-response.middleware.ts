import { NextFunction, Response, Request } from "express";

export interface ApiResponse {
    success: boolean;
    data: any;
    error?: {
        message: string;
        code: number;
    };
}

declare module "express-serve-static-core" {
    interface Response {
        jsonSucces(data: any, satusCode: number): void;
        jsonError(error: any, satusCode: number): void;
    }
}

export function jsonResponseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.jsonSucces = (data: any, satusCode: number) => {
        const response: ApiResponse = {
            success: true,
            data,
        };
        res.status(satusCode).json(response);
    };

    res.jsonError = (errror: any, statusCode: number) => {
        const response: ApiResponse = {
            data: null,
            success: false,
            error: {
                message: errror,
                code: statusCode,
            },
        };
        res.status(statusCode).json(response);
    };

    next();
}
