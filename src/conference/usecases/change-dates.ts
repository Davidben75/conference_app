import e from "express";
import { User } from "../../user/entities/user.entity";
import { Executable } from "../../core/executable.interface";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";
import { AwilixError } from "awilix";
import { IDateGenerator } from "../../core/ports/date-generator.interface";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { Imailer } from "../../core/ports/mailer.interface";
import { testUsers } from "../../user/tests/user-seeds";
import { testConferences } from "../tests/conference-seeds";
import { IUserRepository } from "../../user/ports/user-repository.interface";
import { Conference } from "../entities/conference.entity";
import { ConferenceNotFoundException } from "../exceptions/conference-not-found";
import { ConferenceUpdateForbiddenException } from "../exceptions/conference-update-forbidden";

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
    constructor(
        private readonly repository: IConferenceRepository,
        private readonly dateGeneartor: IDateGenerator,
        private readonly bookingRepository: IBookingRepository,
        private readonly mailer: Imailer,
        private readonly userRepository: IUserRepository
    ) {}
    async execute({ user, conferenceId, startDate, endDate }) {
        const conference = await this.repository.findById(conferenceId);

        if (!conference) throw new ConferenceNotFoundException();

        if (conference.props.organizerId !== user.props.id)
            throw new ConferenceUpdateForbiddenException();

        conference?.update({ startDate, endDate });

        if (conference.isTooClose(this.dateGeneartor.now()))
            throw new Error("The conference must happens in at least 3 days");

        if (conference.isTooLong())
            throw new Error("The updated conference is too long");

        await this.repository.update(conference);
        await this.sendEmailsToParticipants(conference);
    }

    async sendEmailsToParticipants(conference: Conference): Promise<void> {
        const bookings = await this.bookingRepository.findByConferenceId(
            conference.props.id
        );

        const users = (await Promise.all(
            bookings
                .map((booking) =>
                    this.userRepository.findById(booking.props.userId)
                )
                .filter((user) => user !== null)
        )) as User[];

        await Promise.all(
            users.map((user) => {
                this.mailer.send({
                    from: "tedx@fake.com",
                    to: user.props.emailAddress,
                    subject: `The conference ${conference.props.title} has been changed`,
                    body: `The conference ${conference.props.title} has been changed`,
                });
            })
        );
    }
}
