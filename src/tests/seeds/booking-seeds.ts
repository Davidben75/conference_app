import { Booking } from "../../conference/entities/booking.entity";
import { testConferences } from "../../conference/tests/conference-seeds";
import { testUsers } from "../../user/tests/user-seeds";

export const testBooking = {
    bobBooking: new Booking({
        userId: testUsers.bob.props.id,
        conferenceId: testConferences.conference1.props.id,
    }),
    aliceBooking: new Booking({
        userId: testUsers.alice.props.id,
        conferenceId: testConferences.conference1.props.id,
    }),
};
