import { asClass, asValue, createContainer } from "awilix";
import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { CurrentDateGenerator } from "../../../core/adapters/curent-date-generator";
import { InMemoryUserRepository } from "../../../user/adapters/in-memory-user-repository";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { BasicAuthenticator } from "../../../user/services/basic-authenticator";
import { User } from "../../../user/entities/user.entity";
import { ChangeSeats } from "../../../conference/usecases/changs-seats";
import { IConferenceRepository } from "../../../conference/ports/conference-repositiry.interface";
import { IIDGenerator } from "../../../core/ports/id-generator.interface";
import { IDateGenerator } from "../../../core/ports/date-generator.interface";
import { IUserRepository } from "../../../user/ports/user-repository.interface";

const container = createContainer();

container.register({
    conferenceRepository: asClass(InMemoryConferenceRepository).singleton(),
    idGenerator: asClass(RandomIDGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    userRepository: asClass(InMemoryUserRepository).singleton(),
});

const conferenceRepository = container.resolve(
    "conferenceRepository"
) as IConferenceRepository;
const idGenerator = container.resolve("idGenerator") as IIDGenerator;
const dateGenerator = container.resolve("dateGenerator") as IDateGenerator;
const userRepository = container.resolve("userRepository") as IUserRepository;

container.register({
    organizeConferenceUsecase: asValue(
        new OrganizeConference(conferenceRepository, idGenerator, dateGenerator)
    ),
    changesSeats: asValue(new ChangeSeats(conferenceRepository)),
    authenticator: asValue(new BasicAuthenticator(userRepository)),
});

export default container;
