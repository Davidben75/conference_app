import { Booking } from "../../conference/entities/booking.entity";
import { e2eUser } from "./user-seeds";
import { e2eConferences } from "./conference-seeds";
import { BookingFixture } from "../utils/booking.fixture";

export const e2eBooking = {
    bobBooking: new BookingFixture(
        new Booking({
            userId: e2eUser.bob.entity.props.id,
            conferenceId: e2eConferences.conference1.entity.props.id,
        })
    ),
    aliceBooking: new BookingFixture(
        new Booking({
            userId: e2eUser.alice.entity.props.id,
            conferenceId: e2eConferences.conference1.entity.props.id,
        })
    ),
};
