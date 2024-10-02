import { NextFunction, Request, Response } from "express";
import { User } from "../../../user/entities/user.entity";
import { CreateConfererenceInputs } from "../dto/conference.dto";
import { validatorRequest } from "../utils/validate-request";
import { AwilixContainer } from "awilix";

export const organizeConference = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            const { errors, input } = await validatorRequest(
                CreateConfererenceInputs,
                body
            );

            if (errors) {
                return res.status(400).json({ errors });
            }

            const result = await container
                .resolve("organizeConferenceUsecase")
                .execute({
                    user: req.user as User,
                    title: input.title,
                    startDate: new Date(input.startDate),
                    endDate: new Date(input.endDate),
                    seats: input.seats,
                });
            console.log(result);
            return res.jsonSucces({ id: result.id }, 201);
        } catch (error) {
            next(error);
        }
    };
};
