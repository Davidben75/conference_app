import { Application } from "express";
import { TestApp } from "./test-app";
import request from "supertest";
import { e2eUser } from "../seeds/user-seeds";
import { e2eConferences } from "../seeds/conference-seeds";
import container from "../../infrastrcuture/express_api/config/dependency-injection";
import { IConferenceRepository } from "../../conference/ports/conference-repositiry.interface";

describe("Feature : Change number of seats", () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([
            e2eConferences.conference1,
            e2eUser.johnDoe,
        ]);
        app = testApp.expressApp;
    });

    afterEach(async () => {
        await testApp.teardDown();
    });

    describe("Scenario : Happy Path", () => {
        it("Should modify the number of seats", async () => {
            const seats = 100;
            const id = "id-1";
            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .set(
                    "Authorization",
                    e2eUser.johnDoe.createAuthorizationToken()
                )
                .send({
                    seats: 100,
                });

            expect(result.status).toBe(200);

            const conferenceRepository = container.resolve(
                "conferenceRepository"
            ) as IConferenceRepository;
            const fetchedCOnference = await conferenceRepository.findById(id);

            expect(fetchedCOnference).toBeDefined();
            expect(fetchedCOnference?.props.seats).toEqual(seats);
        });
    });

    describe("Scenario : User is not authorized", () => {
        it("Should throw an Error", async () => {
            const seats = 100;
            const id = "id-1";

            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .send({ seats });
            expect(result.statusCode).toBe(403);
        });
    });
});
