import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository";
import { testUsers } from "../../user/tests/user-seeds";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { testBooking } from "../tests/booking-seeds";
import { testConferences } from "../tests/conference-seeds";
import { BookASeat } from "./book-seat";

describe("Feature : Book a seat", () => {
    let useCase: BookASeat;
    let conferenceRepository: InMemoryConferenceRepository;
    let bookingRepository: InMemoryBookingRepository;
    let mailer: InMemoryMailer;
    let userRepository: InMemoryUserRepository;

    beforeEach(async () => {
        conferenceRepository = new InMemoryConferenceRepository();
        await conferenceRepository.create(testConferences.conference1);
        await conferenceRepository.create(testConferences.conference2);

        bookingRepository = new InMemoryBookingRepository();
        await bookingRepository.create(testBooking.bobBooking);

        userRepository = new InMemoryUserRepository();
        await userRepository.create(testUsers.alice);
        await userRepository.create(testUsers.bob);

        mailer = new InMemoryMailer();

        useCase = new BookASeat(
            conferenceRepository,
            userRepository,
            bookingRepository,
            mailer
        );
    });

    describe("Scenario : Happy Path", () => {
        const payload = {
            userId: testUsers.alice.props.id,
            conferenceId: testConferences.conference1.props.id,
        };

        it("Should add the user to the booklist", async () => {
            await useCase.execute(payload);

            const fetchedBooking = await bookingRepository.findByConferenceId(
                payload.conferenceId
            );

            expect(fetchedBooking).toBeDefined();
            // Bob is at the index 0
            expect(fetchedBooking[1].props.userId).toEqual(payload.userId);
        });

        it("Should send an email", async () => {
            await useCase.execute(payload);

            expect(mailer.sentEmails[0]).toEqual({
                from: "tedx@fake.com",
                to: testUsers.alice.props.emailAddress,
                subject: `The conference ${testConferences.conference1.props.title} has been booked`,
                body: `The conference ${testConferences.conference1.props.title} has been booked`,
            });
        });
    });

    describe("Scenario : User alreay booked a seat", () => {
        const payload = {
            userId: testUsers.bob.props.id,
            conferenceId: testConferences.conference1.props.id,
        };

        it("Should throw an error", async () => {
            await expect(useCase.execute(payload)).rejects.toThrow(
                "You have already booked this seat"
            );
        });
    });
});
