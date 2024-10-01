import { differenceInDays } from "date-fns";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { IDateGenerator } from "../../core/ports/date-generator.interface";
import { User } from "../../user/entities/user.entity";
import { Conference } from "../entities/conference.entity";

export class OrganizeConference {
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly idGenerator: IIDGenerator,
        private readonly dateGenerator: IDateGenerator
    ) {}
    async execute(data: {
        user: User;
        title: string;
        startDate: Date;
        endDate: Date;
        seats: number;
    }) {
        const id = this.idGenerator.generate();

        const newConference = new Conference({
            id,
            organizerId: data.user.props.id,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            seats: data.seats,
        });

        if (newConference.isTooClose(this.dateGenerator.now())) {
            throw new Error(
                "Conference must take place at least 3 days in advance"
            );
        }

        if (newConference.hasToManySeats()) {
            throw new Error("Conference can't have more than 1000 seats");
        }

        if (newConference.hasNotEnoughSeats()) {
            throw new Error("Conference must have at least 20 seats");
        }

        if (newConference.isTooLong()) {
            throw new Error("Conference can't exceed 3h");
        }

        await this.repository.create(newConference);

        return { id };
    }
}
