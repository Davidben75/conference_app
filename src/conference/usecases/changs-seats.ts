import { Executable } from "../../core/executable.interface";
import { User } from "../../user/entities/user.entity";
import { ConferenceNotFoundException } from "../exceptions/conference-not-found";
import { ConferenceUpdateForbiddenException } from "../exceptions/conference-update-forbidden";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";

type RequestChangeSeats = {
    user: User;
    conferenceId: string;
    seats: number;
};

type ResponseChangeSeats = void;

export class ChangeSeats
    implements Executable<RequestChangeSeats, ResponseChangeSeats>
{
    constructor(private readonly repository: IConferenceRepository) {}
    async execute({ user, conferenceId, seats }) {
        const conference = await this.repository.findById(conferenceId);
        if (!conference) {
            throw new ConferenceNotFoundException();
        }
        if (conference.props.organizerId !== user.props.id) {
            throw new ConferenceUpdateForbiddenException();
        }
        conference.update({ seats });

        if (conference.hasToManySeats() || conference.hasNotEnoughSeats())
            throw new Error(
                "The conference must have max 1000 seats an min 20"
            );

        await this.repository.update(conference);
    }
}
