import { add, addDays, addHours } from "date-fns";
import { testUsers } from "../../user/tests/user-seeds";
import { testConferences } from "../tests/conference-seeds";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { ChangeDates } from "./change-dates";

describe("Feature change dates of conferrence", () => {
    let useCase: ChangeDates;
    let repository: InMemoryConferenceRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConferences.conference1);
        useCase = new ChangeDates(repository);
    });

    describe("Scenario Happy Path", () => {
        const startDate = addDays(new Date(), 4);
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
    });
});
