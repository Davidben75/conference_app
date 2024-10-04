import { Entity } from "../../core/entities/entity";
type BookingProps = {
    userId: string;
    conferenceId: string;
};

export class Booking extends Entity<BookingProps> {
    public initialState: BookingProps;
    public props: BookingProps;
}
