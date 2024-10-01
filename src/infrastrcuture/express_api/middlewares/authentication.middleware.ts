import { NextFunction, Request, Response } from "express";
import { extractToken } from "../utils/extract-token";
import { InMemoryUserRepository } from "../../../user/adapters/in-memory-user-repository";
import { BasicAuthenticator } from "../../../user/services/basic-authenticator";

const userRepository = new InMemoryUserRepository();
const authenticator = new BasicAuthenticator(userRepository);

declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const credentials = req.headers.authorization;
        if (!credentials) return res.jsonError("Unauthorized", 403);

        const token = extractToken(credentials);
        if (!token) return res.jsonError("Unauthorized", 403);

        const user = await authenticator.authenticate(token);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
