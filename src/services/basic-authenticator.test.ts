import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { User } from "../entity/user.entity";
import { BasicAuthenticator } from "./basic-authenticator";

describe("Authentication", () => {
    describe("Scenario : token is valid ", () => {
        it("Should authenticate an user", async () => {
            const repository = new InMemoryUserRepository();
            await repository.create(
                new User({
                    id: "jhondoe",
                    emailAddress: "johndoe@gmail.com",
                    password: "azerty",
                })
            );

            const payload = Buffer.from("johndoe@gmail.com:azerty").toString(
                "base64"
            );
            const authenticator = new BasicAuthenticator(repository);

            const user = await authenticator.authenticate(payload);

            expect(user.props).toEqual({
                id: "jhondoe",
                emailAddress: "johndoe@gmail.com",
                password: "azerty",
            });
        });
    });

    describe("Scenario : token is not valid ", () => {
        it("It should throw an error", async () => {
            const repository = new InMemoryUserRepository();
            await repository.create(
                new User({
                    id: "jhondoe",
                    emailAddress: "johndoe@gmail.com",
                    password: "azerty",
                })
            );

            const payload = Buffer.from("unknown@gmail.com:azerty").toString(
                "base64"
            );
            const authenticator = new BasicAuthenticator(repository);

            await expect(authenticator.authenticate(payload)).rejects.toThrow(
                "User not found"
            );
        });
    });
});
