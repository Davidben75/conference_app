import { NextFunction, Request, Response } from "express";
import { CurrentDateGenerator } from "../../../adapters/curent-date-generator";
import { InMemoryConferenceRepository } from "../../../adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../adapters/random-id-generator";
import { OrganizeConference } from "../../../usecases/organize-conference";
import { User } from "../../../entity/user.entity";
import { Conference } from "../../../entity/conference.entity";
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
            user: new User({ id: "Babayaga" }),
            title: input.title,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            seats: input.seats,
        });

        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};
