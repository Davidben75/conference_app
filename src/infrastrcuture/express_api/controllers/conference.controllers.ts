import { NextFunction, Request, Response } from "express";
import { CurrentDateGenerator } from "../../../core/adapters/curent-date-generator";
import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { User } from "../../../user/entities/user.entity";
import { Conference } from "../../../conference/entities/conference.entity";
import { CreateConfererenceInputs } from "../dto/conference.dto";
import { validatorRequest } from "../utils/validate-request";

const idGenerator = new RandomIDGenerator();
const currentDateGeneator = new CurrentDateGenerator();
const repository = new InMemoryConferenceRepository();
const usecase = new OrganizeConference(
    repository,
    idGenerator,
    currentDateGeneator
);

export const organizeConference = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req.body;

        const { errors, input } = await validatorRequest(
            CreateConfererenceInputs,
            body
        );

        if (errors) {
            return res.status(400).json({ errors });
        }

        const result = await usecase.execute({
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
