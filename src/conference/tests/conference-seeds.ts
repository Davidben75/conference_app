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
};
