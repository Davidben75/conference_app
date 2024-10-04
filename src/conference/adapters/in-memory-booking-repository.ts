import { Booking } from "../entities/booking.entity";
import { IBookingRepository } from "../ports/booking-repository.interface";

export class InMemoryBookingRepository implements IBookingRepository {
    public database: Booking[] = [];

    async create(booking: Booking): Promise<void> {
        this.database.push(booking);
    }

    async findByConferenceId(conferenceId: string): Promise<Booking[]> {
        return this.database.filter(
            (booking) => booking.props.conferenceId === conferenceId
        );
    }

    async findUserUnbookedConference(
        booking: Booking
    ): Promise<Booking | null> {
        const found = this.database.find(
            (b) =>
                b.props.userId === booking.props.userId &&
                b.props.conferenceId === booking.props.conferenceId
        );
        return found ?? null;
    }
}
