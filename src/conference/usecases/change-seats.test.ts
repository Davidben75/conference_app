import { ChangeSeats } from "./changs-seats";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { testConferences } from "../tests/conference-seeds";
import { testUsers } from "../../user/tests/user-seeds";
import { Booking } from "../entities/booking.entity";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";

describe("Feature : Change seats", () => {
    async function expectSeatsUnchanged() {
        const fetchedCOnference = await repository.findById(
            testConferences.conference1.props.id
        );
        expect(fetchedCOnference?.props.seats).toEqual(50);
    }

    let repository: InMemoryConferenceRepository;
    let useCase: ChangeSeats;
    let bookingRepository: IBookingRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConferences.conference1);

        bookingRepository = new InMemoryBookingRepository();
        useCase = new ChangeSeats(repository, bookingRepository);
    });

    describe("Scenario : Happy Path", () => {
        it("Should change the number of seats", async () => {
            await useCase.execute({
                user: testUsers.johnDoe,
                conferenceId: testConferences.conference1.props.id,
                seats: 100,
            });

            const fetchedCOnference = await repository.findById(
                testConferences.conference1.props.id
            );

            expect(fetchedCOnference!.props.seats).toEqual(100);
        });
    });

    describe("Scenario : Conference doesn't exist", () => {
        it("Should throw an error", async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: "dadazdaz",
                    seats: 100,
                })
            ).rejects.toThrow("Conference not found");

            await expectSeatsUnchanged();
        });
    });

    describe("Scenario : Update teh conference of someone else", () => {
        it("Should throw an error", async () => {
            await expect(
                useCase.execute({
                    user: testUsers.bob,
                    conferenceId: testConferences.conference1.props.id,
                    seats: 100,
                })
            ).rejects.toThrow("You're not allowed to update this conference");

            await expectSeatsUnchanged();
        });
    });

    describe("Scenario : Number of seats >= 1000", () => {
        it("Should throw an error", async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: testConferences.conference1.props.id,
                    seats: 1001,
                })
            ).rejects.toThrow(
                "The conference must have max 1000 seats an min 20"
            );

            await expectSeatsUnchanged();
        });
    });

    describe("Scenario : Number of seats <= 20", () => {
        it("Should throw an error", async () => {
            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: testConferences.conference1.props.id,
                    seats: 15,
                })
            ).rejects.toThrow(
                "The conference must have max 1000 seats an min 20"
            );

            await expectSeatsUnchanged();
        });
    });

    describe("Scenario: Can reduce the number of place below the number of reservation", () => {
        it("Should throw an error", async () => {
            for (let i = 0; i < 30; i++) {
                await bookingRepository.create(
                    new Booking({
                        userId: `${i + 1}`,
                        conferenceId: testConferences.conference1.props.id,
                    })
                );
            }

            await expect(
                useCase.execute({
                    user: testUsers.johnDoe,
                    conferenceId: testConferences.conference1.props.id,
                    seats: 25,
                })
            ).rejects.toThrow(
                "You cannot decrease the number of seats below the number of bookings"
            );

            await expectSeatsUnchanged();
        });
    });
});
