import { addDays, addHours, nextDay } from "date-fns";
import { User } from "../../user/entities/user.entity";
import { Conference } from "../entities/conference.entity";
import { ChangeSeats } from "./changs-seats";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";

describe("Feature : Change seats", () => {
    const jhondoe = new User({
        id: "jhondoe",
        emailAddress: "jhonedoe@gmail.com",
        password: "azerty",
    });

    const bob = new User({
        id: "bob",
        emailAddress: "bob@gmail.com",
        password: "azerty",
    });

    const conference = new Conference({
        id: "id-1",
        title: "My first Conference",
        organizerId: jhondoe.props.id,
        seats: 50,
        startDate: addDays(new Date(), 4),
        endDate: addDays(addHours(new Date(), 2), 4),
    });

    let repository: InMemoryConferenceRepository;
    let useCase: ChangeSeats;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(conference);
        useCase = new ChangeSeats(repository);
    });

    describe("Scenario : Happy Path", () => {
        it("Should change the number of seats", async () => {
            await useCase.execute({
                user: jhondoe,
                conferenceId: conference.props.id,
                seats: 100,
            });

            const fetchedCOnference = await repository.findById(
                conference.props.id
            );

            expect(fetchedCOnference!.props.seats).toEqual(100);
        });
    });

    describe("Scenario : Conference doesn't exist", () => {
        it("Should throw an error", async () => {
            await expect(
                useCase.execute({
                    user: jhondoe,
                    conferenceId: "dadazdaz",
                    seats: 100,
                })
            ).rejects.toThrow("Conference not found");
        });
    });

    describe("Scenario : Update teh conference of someone else", () => {
        it("Should throw an error", async () => {
            await expect(
                useCase.execute({
                    user: bob,
                    conferenceId: conference.props.id,
                    seats: 100,
                })
            ).rejects.toThrow("You're not allowed to change this conference");
        });
    });
});
