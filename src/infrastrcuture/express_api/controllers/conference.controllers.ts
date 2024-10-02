import { NextFunction, Request, Response } from "express";
import { User } from "../../../user/entities/user.entity";
import {
    ChangeSeatsInputs,
    CreateConfererenceInputs,
} from "../dto/conference.dto";
import { validatorRequest } from "../utils/validate-request";
import { AwilixContainer } from "awilix";
import { Conference } from "../../../conference/entities/conference.entity";
import { IConferenceRepository } from "../../../conference/ports/conference-repositiry.interface";
import { ChangeSeats } from "../../../conference/usecases/changs-seats";

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
            return res.jsonSucces({ id: result.id }, 201);
        } catch (error) {
            next(error);
        }
    };
};

export const changeSeats = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const body = req.body;

            const { errors, input } = await validatorRequest(
                ChangeSeatsInputs,
                body
            );

            if (errors) return res.jsonError(errors, 400);

            const result = await (
                container.resolve("changesSeats") as ChangeSeats
            ).execute({
                user: req.user,
                conferenceId: id,
                seats: input.seats,
            });

            return res.jsonSucces(
                { message: "The number of seats was changed corectly" },
                200
            );
        } catch (error) {
            next(error);
        }
    };
};
