import { Model } from "mongoose";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../ports/user-repository.interface";
import { MongoUser } from "./mongo-user";

export class MongoUserRepository implements IUserRepository {
    constructor(private readonly model: Model<MongoUser.UserDocument>) {}
    async findByEmail(emailAddress: string): Promise<User | null> {
        const user = await this.model.findOne({ emailAddress });

        return new User({
            id: user!._id,
            emailAddress: user!.emailAddress,
            password: user!.password,
        });
    }

    async create(user: User): Promise<void> {
        throw new Error("NOT IMPLEMENTED");
    }
}
