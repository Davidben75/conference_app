import { addDays, addHours } from "date-fns";
import app from "../infrastrcuture/express_api/app";
import request from "supertest";
import { User } from "../user/entities/user.entity";
import { InMemoryUserRepository } from "../user/adapters/in-memory-user-repository";
import { BasicAuthenticator } from "../user/services/basic-authenticator";
import container from "../infrastrcuture/express_api/config/dependency-injection";

describe("Feature : Organize conference", () => {
    const johnDoe = new User({
        id: "jhondoe",
        emailAddress: "johndoe@gmail.com",
        password: "azerty",
    });

    let repository: InMemoryUserRepository;

    beforeEach(async () => {
        repository = container.resolve("userRepository");
        await repository.create(johnDoe);
    });

    it("Should organize a conference", async () => {
        const token = Buffer.from(
            `${johnDoe.props.emailAddress}:${johnDoe.props.password}`
        ).toString("base64");

        // jest.spyOn(
        //     BasicAuthenticator.prototype,
        //     "authenticate"
        // ).mockResolvedValue(johnDoe);

        const result = await request(app)
            .post("/conference")
            .set("Authorization", `Basic ${token}`)
            .send({
                title: "My first conference",
                seats: 100,
                startDate: addDays(new Date(), 4).toISOString(),
                endDate: addDays(addHours(new Date(), 2), 4).toISOString(),
            });

        console.log(result);
        expect(result.status).toBe(201);
        expect(result.body.data).toEqual({ id: expect.any(String) });
    });
});
