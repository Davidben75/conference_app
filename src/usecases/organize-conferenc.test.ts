import { FixedDateGenerator } from "../adapters/fixed-date-generator";
import { FixedIDGenerator } from "../adapters/fixed-id-generator";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { Conference } from "../entity/conference.entity";
import { User } from "../entity/user.entity";
import { OrganizeConference } from "./organize-conference";

describe("Feature : Organize conference", () => {
    function expectConferenceToEqual(conference: Conference) {
        expect(conference.props).toEqual({
            id: "id-1",
            organizerId: "Babayaga",
            title: "My first conference",
            seats: 100,
            startDate: new Date("2024-09-01T10:00:00.000Z"),
            endDate: new Date("2024-09-01T11:00:00.000Z"),
        });
    }

    const JhonWick = new User({ id: "Babayaga" });

    let repository: InMemoryConferenceRepository;
    let idGenerator: FixedIDGenerator;
    let useCase: OrganizeConference;
    let dateGenerator: FixedDateGenerator;

    beforeEach(() => {
        repository = new InMemoryConferenceRepository();
        idGenerator = new FixedIDGenerator();
        dateGenerator = new FixedDateGenerator();
        useCase = new OrganizeConference(
            repository,
            idGenerator,
            dateGenerator
        );
    });

    describe("Scenario : Happy Path", () => {
        const payload = {
            title: "My first conference",
            user: JhonWick,
            seats: 100,
            startDate: new Date("2024-09-01T10:00:00.000Z"),
            endDate: new Date("2024-09-01T11:00:00.000Z"),
        };

        it("Should return the ID", async () => {
            const reuslt = await useCase.execute(payload);
            expect(reuslt.id).toEqual("id-1");
        });

        it("Should insert the conference into the database", async () => {
            await useCase.execute(payload);

            const createdConference = repository.database[0];

            expect(repository.database.length).toBe(1);
            expect(createdConference.props.title).toBe("My first conference");
            expectConferenceToEqual(createdConference);
        });
    });

    describe("Scenario : Conference take place too early", () => {
        const payload = {
            title: "My first conference",
            user: JhonWick,
            seats: 100,
            startDate: new Date("2024-01-02T10:00:00.000Z"),
            endDate: new Date("2024-01-02T11:00:00.000Z"),
        };

        it("Should throw an error", async () => {
            await expect(() => useCase.execute(payload)).rejects.toThrow(
                "Conference must take place at least 3 days in advance"
            );
        });

        it("Should not create a conference", async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}
            expect(repository.database.length).toBe(0);
        });
    });

    describe("Scenario : the conference has too many seats", () => {
        const payload = {
            title: "My first conference",
            seats: 1001,
            user: JhonWick,
            startDate: new Date("2024-01-05T10:00:00.000Z"),
            endDate: new Date("2024-01-05T11:00:00.000Z"),
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "Conference can't have more than 1000 seats"
            );
        });

        it("Should not create a conference", async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}
            expect(repository.database.length).toBe(0);
        });
    });

    describe("Scenario : the conference hasn't enough seats", () => {
        const payload = {
            title: "My first conference",
            seats: 15,
            user: JhonWick,
            startDate: new Date("2024-01-05T10:00:00.000Z"),
            endDate: new Date("2024-01-05T11:00:00.000Z"),
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "Conference must have at least 20 seats"
            );
        });

        it("Should not create a conference", async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}
            expect(repository.database.length).toBe(0);
        });
    });

    describe("Scenario : The conference exceeds 3h", () => {
        const payload = {
            title: "My first conference",
            seats: 50,
            user: JhonWick,
            startDate: new Date("2024-01-05T10:00:00.000Z"),
            endDate: new Date("2024-01-05T14:00:00.000Z"),
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "Conference can't exceed 3h"
            );
        });

        it("Should not create a conference", async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (error) {}
            expect(repository.database.length).toBe(0);
        });
    });
});
