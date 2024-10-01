import { User } from "../entity/user.entity";

export interface IAuthenticator {
    authenticate(token: string): Promise<User>;
}
