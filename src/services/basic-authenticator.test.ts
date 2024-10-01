import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { User } from "../entity/user.entity";
import { BasicAuthenticator } from "./basic-authenticator";

describe("Authentication", () => {
    let repository: InMemoryUserRepository;
    let authenticator: BasicAuthenticator;

    beforeEach(async () => {
        repository = new InMemoryUserRepository();
        await repository.create(
            new User({
                id: "jhondoe",
                emailAddress: "johndoe@gmail.com",
                password: "azerty",
            })
        );

        authenticator = new BasicAuthenticator(repository);
    });

    describe("Scenario : token is valid ", () => {
        it("Should return an user", async () => {
            const payload = Buffer.from("johndoe@gmail.com:azerty").toString(
                "base64"
            );

            const user = await authenticator.authenticate(payload);

            expect(user.props).toEqual({
                id: "jhondoe",
                emailAddress: "johndoe@gmail.com",
                password: "azerty",
            });
        });
    });

    describe("Scenario : email is not valid ", () => {
        it("It should throw an error", async () => {
            const payload = Buffer.from("unknown@gmail.com:azerty").toString(
                "base64"
            );

            await expect(authenticator.authenticate(payload)).rejects.toThrow(
                "Wrong credentials"
            );
        });
    });

    describe("Scenario : password is not valid ", () => {
        it("It should throw an error", async () => {
            const payload = Buffer.from("unknown@gmail.com:azerty").toString(
                "base64"
            );

            await expect(authenticator.authenticate(payload)).rejects.toThrow(
                "Wrong credentials"
            );
        });
    });
});
