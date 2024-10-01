import { Response, Request, NextFunction } from "express";

export function errorHandlerMiddleware(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const formattedError = {
        message: error.message || "An error occurs",
        code: error.stattuscode || 500,
    };

    res.status(formattedError.code).json({
        success: false,
        data: null,
        error: formattedError,
    });
}
