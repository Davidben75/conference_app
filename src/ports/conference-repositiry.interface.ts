import { Conference } from "../entity/conference.entity";

export interface IConferenceRepository {
    create(conference: Conference): Promise<void>;
}
