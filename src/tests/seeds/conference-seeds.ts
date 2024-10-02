import { addDays, addHours } from "date-fns";
import { Conference } from "../../conference/entities/conference.entity";
import { ConferenceFixture } from "../utils/conference.fixture";
import { e2eUser } from "./user-seeds";

const startDate = addDays(new Date(), 4);
const endDate = addHours(addDays(new Date(), 2), 4);

export const e2eConferences = {
    conference1: new ConferenceFixture(
        new Conference({
            id: "id-1",
            organizerId: e2eUser.johnDoe.entity.props.id,
            title: "My first conference",
            startDate: startDate,
            endDate: endDate,
            seats: 50,
        })
    ),
};
