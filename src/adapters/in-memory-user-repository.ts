import { User } from "../entity/user.entity";
import { IUserRepository } from "../ports/user-repository.interface";

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    async create(user: User): Promise<void> {
        this.users.push(user);
    }

    async findByEmail(emailAddress: string): Promise<User | null> {
        const user = this.users.find(
            (user) => user.props.emailAddress == emailAddress
        );
        return user ?? null;
    }
}
