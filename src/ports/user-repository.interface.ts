import { User } from "../entity/user.entity";

export interface IUserRepository {
    create(user: User): Promise<void>;
    findByEmail(emailAddress: string): Promise<User | null>;
}
