import { Model } from "mongoose";
import { TestApp } from "../../../tests/utils/test-app";

import { testConferences } from "../../tests/conference-seeds";
import { MongoConferenceRepository } from "./mongo-conference-repository";
import { MongoConference } from "./mongo-conference";

describe("MongoUserRepository", () => {
    let app: TestApp;
    let model: Model<MongoConference.ConferenceDocument>;
    let repository: MongoConferenceRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoConference.ConferenceModel;
        await model.deleteMany({});
        repository = new MongoConferenceRepository(model);

        const record = new model({
            _id: testConferences.conference1.props.id,
            organizerId: testConferences.conference1.props.organizerId,
            title: testConferences.conference1.props.title,
            seats: testConferences.conference1.props.seats,
            startDate: testConferences.conference1.props.startDate,
            endDate: testConferences.conference1.props.endDate,
        });

        await record.save();
    });

    afterEach(async () => {
        await app.teardDown();
    });

    describe("Scenario : Find the conference", () => {
        it("Should return the conference", async () => {
            const conference = await repository.findById(
                testConferences.conference1.props.id
            );

            expect(conference).toBeDefined();
            expect(conference?.props).toEqual(
                testConferences.conference1.props
            );
        });

        it("Should return null", async () => {
            const conference = await repository.findById("wrong-id");
            expect(conference).toBeNull();
        });
    });

    describe("Scenario : Create a conference", () => {
        it("Should create a conference", async () => {
            await repository.create(testConferences.conference2);

            const fetchedConference = await model.findOne({
                _id: testConferences.conference2.props.id,
            });

            expect(fetchedConference?.toObject()).toEqual({
                _id: testConferences.conference2.props.id,
                organizerId: testConferences.conference2.props.organizerId,
                title: testConferences.conference2.props.title,
                seats: testConferences.conference2.props.seats,
                startDate: testConferences.conference2.props.startDate,
                endDate: testConferences.conference2.props.endDate,
                __v: 0,
            });
        });
    });

    describe("Scenario : Update a conference", () => {
        it("Should update a conference", async () => {
            const conference = await repository.findById(
                testConferences.conference1.props.id
            );

            conference!.props.seats = 69;

            await repository.update(conference!);

            const fetchedConference = await model.findOne({
                _id: testConferences.conference1.props.id,
            });

            expect(fetchedConference?.toObject()).toEqual({
                _id: testConferences.conference1.props.id,
                organizerId: testConferences.conference1.props.organizerId,
                title: testConferences.conference1.props.title,
                seats: 69,
                startDate: testConferences.conference1.props.startDate,
                endDate: testConferences.conference1.props.endDate,
                __v: 0,
            });
        });
    });
});
