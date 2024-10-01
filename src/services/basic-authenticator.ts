import { User } from "../entity/user.entity";
import { IAuthenticator } from "../ports/authenticator.interface";
import { IUserRepository } from "../ports/user-repository.interface";

export class BasicAuthenticator implements IAuthenticator {
    constructor(private readonly userRepository: IUserRepository) {}
    async authenticate(token: string): Promise<User> {
        const decoded = Buffer.from(token, "base64").toString("utf-8"); //johndoe@gmail.com:azerty
        const [emailAddress, password] = decoded.split(":");

        const user = await this.userRepository.findByEmail(emailAddress);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}
