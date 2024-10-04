import { Application } from "express";
import { TestApp } from "./utils/test-app";
import { e2eConferences } from "./seeds/conference-seeds";
import { e2eUser } from "./seeds/user-seeds";
import request from "supertest";
import { addDays, addHours } from "date-fns";
import { IConferenceRepository } from "../conference/ports/conference-repositiry.interface";
import container from "../infrastrcuture/express_api/config/dependency-injection";
import { e2eBooking } from "./seeds/booking-seeds";

describe("Feature : Change the dates", () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([
            e2eConferences.conference1,
            e2eUser.johnDoe,
            e2eUser.alice,
            e2eUser.bob,
            e2eBooking.bobBooking,
            e2eBooking.aliceBooking,
        ]);
        app = testApp.expressApp;
    });

    afterEach(async () => {
        await testApp.teardDown();
    });

    describe("Scenario : Happy Path", () => {
        it("Should modify the dates of the conference", async () => {
            const startDate = addDays(new Date(), 8);
            const endDate = addDays(addHours(new Date(), 2), 8);

            const id = e2eConferences.conference1.entity.props.id;
            const result = await request(app)
                .patch(`/conference/dates/${id}`)
                .set(
                    "Authorization",
                    e2eUser.johnDoe.createAuthorizationToken()
                )
                .send({
                    startDate: startDate,
                    endDate: endDate,
                });

            expect(result.status).toBe(200);

            const conferenceRepository = container.resolve(
                "conferenceRepository"
            ) as IConferenceRepository;

            const fetchedConference = await conferenceRepository.findById(id);

            expect(fetchedConference).toBeDefined();
            expect(fetchedConference?.props).toEqual({
                id: result.body.data.id,
                title: "My first conference",
                seats: 50,
                organizerId: e2eUser.johnDoe.entity.props.id,
                startDate: startDate,
                endDate: endDate,
            });
        });
    });

    describe("Scenario : Unauthorized", () => {
        it("Should return 403", async () => {
            const startDate = addDays(new Date(), 8);
            const endDate = addDays(addHours(new Date(), 2), 8);

            const id = e2eConferences.conference1.entity.props.id;
            const result = await request(app)
                .patch(`/conference/dates/${id}`)
                .send({
                    startDate: startDate,
                    endDate: endDate,
                });

            expect(result.status).toBe(403);
        });
    });
});
