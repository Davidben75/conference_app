import express from "express";
import { jsonResponseMiddleware } from "../../infrastrcuture/express_api/middlewares/json-response.middleware";
import conferenceRoutes from "../../infrastrcuture/express_api/routes/conference.routes";
import { errorHandlerMiddleware } from "../../infrastrcuture/express_api/middlewares/error-handler.middleware";
import { IFixture } from "./fixture.interface";
import { AwilixContainer } from "awilix";
import container from "../../infrastrcuture/express_api/config/dependency-injection";
import mongoose from "mongoose";

export class TestApp {
    private app: express.Application;
    private container: AwilixContainer;

    constructor() {
        this.app = express();
        this.container = container;
    }

    async setup() {
        await mongoose.connect(
            "mongodb://admin:qwerty@localhost:3702/conferences?authSource=admin"
        );
        await mongoose.connection.db?.collection("users").deleteMany({});
        await mongoose.connection.db?.collection("conferences").deleteMany({});
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(jsonResponseMiddleware);
        this.app.use(conferenceRoutes);

        this.app.use(errorHandlerMiddleware);
    }

    async loadAllFixtures(fixtures: IFixture[]) {
        return Promise.all(
            fixtures.map((fixture) => fixture.load(this.container))
        );
    }

    async teardDown() {
        await mongoose.connection.close();
    }

    get expressApp() {
        return this.app;
    }
}
