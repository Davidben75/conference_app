import { asClass, asValue, createContainer } from "awilix";
import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { CurrentDateGenerator } from "../../../core/adapters/curent-date-generator";
import { InMemoryUserRepository } from "../../../user/adapters/in-memory-user-repository";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { BasicAuthenticator } from "../../../user/services/basic-authenticator";
import { User } from "../../../user/entities/user.entity";

const container = createContainer();

container.register({
    conferenceRespository: asClass(InMemoryConferenceRepository).singleton(),
    idGenerator: asClass(RandomIDGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    userRepository: asClass(InMemoryUserRepository).singleton(),
});

const conferenceRespository = container.resolve("conferenceRespository");
const idGenerator = container.resolve("idGenerator");
const dateGenerator = container.resolve("dateGenerator");
const userRepository = container.resolve("userRepository");
userRepository.create(
    new User({
        id: "jhondoe",
        emailAddress: "johndoe@gmail.com",
        password: "azerty",
    })
);

container.register({
    organizeConferenceUsecase: asValue(
        new OrganizeConference(
            conferenceRespository,
            idGenerator,
            dateGenerator
        )
    ),
    authenticator: asValue(new BasicAuthenticator(userRepository)),
});

export default container;
