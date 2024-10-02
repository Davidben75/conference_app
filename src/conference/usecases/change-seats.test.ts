import { ChangeSeats } from "./changs-seats";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { testConferences } from "../tests/conference-seeds";
import { testUsers } from "../../user/tests/user-seeds";

describe("Feature : Change seats", () => {
    async function expectSeatsUnchanged() {
        const fetchedCOnference = await repository.findById(
            testConferences.conference1.props.id
        );
        expect(fetchedCOnference?.props.seats).toEqual(50);
    }

    let repository: InMemoryConferenceRepository;
    let useCase: ChangeSeats;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConferences.conference1);
        useCase = new ChangeSeats(repository);
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
            ).rejects.toThrow("You're not allowed to change this conference");

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
});
