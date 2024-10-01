import { Conference } from "../entities/conference.entity";
import { IConferenceRepository } from "../ports/conference-repositiry.interface";

export class InMemoryConferenceRepository implements IConferenceRepository {
    database: Conference[] = [];

    async create(conference: Conference): Promise<void> {
        this.database.push(conference);
    }

    async findById(id: string): Promise<Conference | null> {
        return this.database.find((conf) => conf.props.id === id) ?? null;
    }
}
