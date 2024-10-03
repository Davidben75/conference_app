import e from "express";
import { User } from "../../user/entities/user.entity";
import { Executable } from "../../core/executable.interface";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";
import { AwilixError } from "awilix";

type RequestChangeDates = {
    user: User;
    conferenceId: string;
    startDate: Date;
    endDate: Date;
};

type ResponseChangeDates = void;

export class ChangeDates
    implements Executable<RequestChangeDates, ResponseChangeDates>
{
    constructor(private readonly repository: IConferenceRepository) {}
    async execute({ user, conferenceId, startDate, endDate }) {
        const conference = await this.repository.findById(conferenceId);

        conference?.update({ startDate, endDate });

        await this.repository.update(conference!);
    }
}
