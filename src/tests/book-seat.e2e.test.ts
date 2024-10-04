import { Application } from "express";
import { TestApp } from "./utils/test-app";
import { e2eUser } from "./seeds/user-seeds";
import { e2eConferences } from "./seeds/conference-seeds";
import { e2eBooking } from "./seeds/booking-seeds";
import request from "supertest";

describe("Feature : Book seat", () => {
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
        ]);
        app = testApp.expressApp;
    });

    afterEach(async () => {
        await testApp.teardDown();
    });

    describe("Scenario : Happy Path", () => {
        it("Should book a seat", async () => {
            const id = "id-1";
            const result = await request(app)
                .post(`/conference/booking/${id}`)
                .set("Authorization", e2eUser.alice.createAuthorizationToken());
            expect(result.status).toBe(201);
        });
    });
});
