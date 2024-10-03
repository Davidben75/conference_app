import { Model } from "mongoose";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../ports/user-repository.interface";
import { MongoUser } from "./mongo-user";
import { AwilixError } from "awilix";

class UserMapper {
    toCore(model: MongoUser.UserDocument): User {
        return new User({
            id: model._id,
            emailAddress: model.emailAddress,
            password: model.password,
        });
    }

    toPersitence(user: User): MongoUser.UserDocument {
        return new MongoUser.UserModel({
            _id: user.props.id,
            emailAddress: user.props.emailAddress,
            password: user.props.password,
        });
    }
}

export class MongoUserRepository implements IUserRepository {
    private readonly mapper = new UserMapper();

    constructor(private readonly model: Model<MongoUser.UserDocument>) {}
    async findByEmail(emailAddress: string): Promise<User | null> {
        const user = await this.model.findOne({ emailAddress });

        if (!user) return null;

        return this.mapper.toCore(user);
    }

    async create(user: User): Promise<void> {
        const record = this.mapper.toPersitence(user);

        await record.save();
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.model.findById({ _id: id });
        if (!user) return null;

        return this.mapper.toCore(user);
    }
}
