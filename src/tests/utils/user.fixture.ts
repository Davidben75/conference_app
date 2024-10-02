import { AwilixContainer } from "awilix";
import { User } from "../../user/entities/user.entity";
import { IFixture } from "./fixture.interface";
import { IUserRepository } from "../../user/ports/user-repository.interface";

export class UserFixture implements IFixture {
    constructor(public entity: User) {}

    async load(container: AwilixContainer) {
        const repository = container.resolve(
            "userRepository"
        ) as IUserRepository;
        await repository.create(this.entity);
    }

    createAuthorizationToken() {
        return (
            "Basic " +
            Buffer.from(
                `${this.entity.props.emailAddress}:${this.entity.props.password}`
            ).toString("base64")
        );
    }
}
