import { User } from "../../user/entities/user.entity";
import { UserFixture } from "../utils/user.fixture";

export const e2eUser = {
    johnDoe: new UserFixture(
        new User({
            id: "jhondoe",
            emailAddress: "johndoe@gmail.com",
            password: "azerty",
        })
    ),
};
