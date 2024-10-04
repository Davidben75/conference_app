import { add, addDays, addHours, sub } from "date-fns";
import { testUsers } from "../../user/tests/user-seeds";
import { testConferences } from "../tests/conference-seeds";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { ChangeDates } from "./change-dates";
import { FixedDateGenerator } from "../../core/adapters/fixed-date-generator";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";
import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository";
import { testBooking } from "../tests/booking-seeds";

describe("Feature change dates of conferrence", () => {
    async function datesRemainUnchanged() {
        const conference = await repository.findById(
            testConferences.conference1.props.id
        );
        expect(conference?.props.startDate).toEqual(
            testConferences.conference1.props.startDate
        );
        expect(conference?.props.endDate).toEqual(
            testConferences.conference1.props.endDate
        );
    }

    let useCase: ChangeDates;
    let repository: InMemoryConferenceRepository;
    let dateGeneartor: FixedDateGenerator;
    let bookingRepository: InMemoryBookingRepository;
    let mailer: InMemoryMailer;
    let userRepository: InMemoryUserRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConferences.conference1);

        dateGeneartor = new FixedDateGenerator();

        bookingRepository = new InMemoryBookingRepository();
        await bookingRepository.create(testBooking.bobBooking);
        await bookingRepository.create(testBooking.aliceBooking);

        mailer = new InMemoryMailer();
        userRepository = new InMemoryUserRepository();
        await userRepository.create(testUsers.bob);
        await userRepository.create(testUsers.alice);

        useCase = new ChangeDates(
            repository,
            dateGeneartor,
            bookingRepository,
            mailer,
            userRepository
        );
    });

    describe("Scenario Happy Path", () => {
        const startDate = addDays(new Date(), 8);
        const endDate = addDays(addHours(new Date(), 2), 8);

        const payload = {
            user: testUsers.johnDoe,
            conferenceId: testConferences.conference1.props.id,
            startDate: startDate,
            endDate: endDate,
        };

        it("Should change the date", async () => {
            await useCase.execute(payload);
            const fetchedCOnference = await repository.findById(
                testConferences.conference1.props.id
            );

            expect(fetchedCOnference?.props.startDate).toEqual(startDate);
            expect(fetchedCOnference?.props.endDate).toEqual(endDate);
        });

        it("Should send an email", async () => {
            await useCase.execute(payload);

            expect(mailer.sentEmails[0]).toEqual({
                from: "tedx@fake.com",
                to: testUsers.bob.props.emailAddress,
                subject: `The conference ${testConferences.conference1.props.title} has been changed`,
                body: `The conference ${testConferences.conference1.props.title} has been changed`,
            });
        });
    });

    describe("Scenario : Conference doesn't exist", () => {
        const startDate = addDays(new Date(), 4);
        const endDate = addDays(addHours(new Date(), 2), 8);

        const payload = {
            user: testUsers.johnDoe,
            conferenceId: "invalid-id",
            startDate: startDate,
            endDate: endDate,
        };
        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "Conference not found"
            );

            await datesRemainUnchanged();
        });
    });

    describe("Scenario Update conference of someone else", () => {
        const startDate = addDays(new Date(), 4);
        const endDate = addDays(addHours(new Date(), 2), 8);

        const payload = {
            user: testUsers.bob,
            conferenceId: testConferences.conference1.props.id,
            startDate: startDate,
            endDate: endDate,
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "You're not allowed to change this conference"
            );

            await datesRemainUnchanged();
        });
    });

    describe("Scenario : the new startDate is too cloose", () => {
        const startDate = new Date("2024-01-02T00:00:00.000Z");
        const endDate = new Date("2024-01-02T00:00:00.000Z");

        const payload = {
            user: testUsers.johnDoe,
            conferenceId: testConferences.conference1.props.id,
            startDate: startDate,
            endDate: endDate,
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "The conference must happens in at least 3 days"
            );
            await datesRemainUnchanged();
        });
    });

    describe("Scenario : the new conference is to long", () => {
        const startDate = new Date("2024-01-04T00:00:00.000Z");
        const endDate = new Date("2024-01-04T05:00:00.000Z");

        const payload = {
            user: testUsers.johnDoe,
            conferenceId: testConferences.conference1.props.id,
            startDate: startDate,
            endDate: endDate,
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "The updated conference is too long"
            );
            await datesRemainUnchanged();
        });
    });
});
