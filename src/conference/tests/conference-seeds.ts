import { addDays, addHours } from "date-fns";
import { Conference } from "../entities/conference.entity";

export const testConferences = {
    conference1: new Conference({
        id: "id-1",
        organizerId: "jhondoe",
        title: "My first conference",
        seats: 50,
        startDate: addDays(new Date(), 4),
        endDate: addDays(addHours(new Date(), 2), 4),
    }),
    conference2: new Conference({
        id: "id-2",
        organizerId: "bob",
        title: "Conference about Sponge",
        seats: 1000,
        startDate: addDays(new Date(), 8),
        endDate: addDays(addHours(new Date(), 2), 8),
    }),
};
