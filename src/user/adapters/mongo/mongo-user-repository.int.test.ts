import { Model } from "mongoose";
import { TestApp } from "../../../tests/utils/test-app";
import { MongoUser } from "./mongo-user";
import { MongoUserRepository } from "./mongo-user-repository";
import { testUsers } from "../../tests/user-seeds";
import { AwilixError } from "awilix";

describe("MongoUserRepository", () => {
    let app: TestApp;
    let model: Model<MongoUser.UserDocument>;
    let repository: MongoUserRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoUser.UserModel;
        repository = new MongoUserRepository(model);
    });

    afterEach(async () => {
        await app.teardDown();
    });

    describe("Scenario : findByEmailAddress", () => {
        it("Should find user corresponding to the email address", async () => {
            const record = new model({
                _id: testUsers.johnDoe.props.id,
                emailAddress: testUsers.johnDoe.props.emailAddress,
                password: testUsers.johnDoe.props.password,
            });

            await record.save();

            const user = await repository.findByEmail(
                testUsers.johnDoe.props.emailAddress
            );

            expect(user?.props).toEqual(testUsers.johnDoe.props);
        });
    });
});
