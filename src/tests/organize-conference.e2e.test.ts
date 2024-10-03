import { addDays, addHours } from "date-fns";
import request from "supertest";
import { User } from "../user/entities/user.entity";
import { InMemoryUserRepository } from "../user/adapters/in-memory-user-repository";
import container from "../infrastrcuture/express_api/config/dependency-injection";
import { IConferenceRepository } from "../conference/ports/conference-repositiry.interface";
import { TestApp } from "./utils/test-app";
import { Application } from "express";
import { e2eUser } from "./seeds/user-seeds";

describe("Feature : Organize conference", () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([e2eUser.johnDoe]);
        app = testApp.expressApp;
    });

    afterAll(async () => {
        await testApp.teardDown();
    });

    it("Should organize a conference", async () => {
        const startDate = addDays(new Date(), 4);
        const endDate = addDays(addHours(new Date(), 2), 4);

        const result = await request(app)
            .post("/conference")
            .set("Authorization", e2eUser.johnDoe.createAuthorizationToken())
            .send({
                title: "My first conference",
                seats: 100,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });

        expect(result.status).toBe(201);
        expect(result.body.data).toEqual({ id: expect.any(String) });

        const conferenceRepository = container.resolve(
            "conferenceRepository"
        ) as IConferenceRepository;
        const fetchedConference = await conferenceRepository.findById(
            result.body.data.id
        );

        expect(fetchedConference).toBeDefined();
        expect(fetchedConference?.props).toEqual({
            id: result.body.data.id,
            title: "My first conference",
            seats: 100,
            organizerId: e2eUser.johnDoe.entity.props.id,
            startDate: startDate,
            endDate: endDate,
        });
    });
});
