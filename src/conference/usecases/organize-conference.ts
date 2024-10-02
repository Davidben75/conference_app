import { differenceInDays } from "date-fns";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";
import { IIDGenerator } from "../../core/ports/id-generator.interface";
import { IDateGenerator } from "../../core/ports/date-generator.interface";
import { User } from "../../user/entities/user.entity";
import { Conference } from "../entities/conference.entity";
import { Executable } from "../../core/executable.interface";

type OrganizeRequest = {
    user: User;
    title: string;
    startDate: Date;
    endDate: Date;
    seats: number;
};

type OrganizeResponse = {
    id: string;
};

export class OrganizeConference
    implements Executable<OrganizeRequest, OrganizeResponse>
{
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly idGenerator: IIDGenerator,
        private readonly dateGenerator: IDateGenerator
    ) {}
    async execute({ user, title, startDate, endDate, seats }) {
        const id = this.idGenerator.generate();

        const newConference = new Conference({
            id,
            organizerId: user.props.id,
            title,
            startDate,
            endDate,
            seats,
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
