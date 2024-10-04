import { Booking } from "../entities/booking.entity";

export interface IBookingRepository {
    create(booking: Booking): Promise<void>;
    findByConferenceId(conferenceId: string): Promise<Booking[]>;
    findUserUnbookedConference(booking: Booking): Promise<Booking | null>;
}
