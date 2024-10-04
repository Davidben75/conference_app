import { DomainException } from "../../core/exceptions/domain-exception";
import { Executable } from "../../core/executable.interface";
import { Imailer } from "../../core/ports/mailer.interface";
import { IUserRepository } from "../../user/ports/user-repository.interface";
import { Booking } from "../entities/booking.entity";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";

type RequestBookASeat = {
    userId: string;
    conferenceId: string;
};

type ResponseBookASeat = void;

export class BookASeat
    implements Executable<RequestBookASeat, ResponseBookASeat>
{
    constructor(
        private readonly conferencRepository: IConferenceRepository,
        private readonly userRepository: IUserRepository,
        private readonly bookingRepostory: IBookingRepository,
        private readonly mailer: Imailer
    ) {}

    async execute({ userId, conferenceId }) {
        const conference = await this.conferencRepository.findById(
            conferenceId
        );

        if (!conference) throw new DomainException("Conference doesn't exist");

        const booking = new Booking({
            userId,
            conferenceId,
        });

        if (
            (await this.bookingRepostory.findUserUnbookedConference(
                booking
            )) !== null
        )
            throw new DomainException("You have already booked this seat");

        await this.bookingRepostory.create(booking);
        await this.sendMailToUser(booking);
    }

    async sendMailToUser(booking: Booking) {
        const user = await this.userRepository.findById(booking.props.userId);
        const conference = await this.conferencRepository.findById(
            booking.props.conferenceId
        );

        this.mailer.send({
            from: "tedx@fake.com",
            to: user!.props.emailAddress,
            subject: `The conference ${
                conference!.props.title
            } has been booked`,
            body: `The conference ${conference!.props.title} has been booked`,
        });
    }
}
