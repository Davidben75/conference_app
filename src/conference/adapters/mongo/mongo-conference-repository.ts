import { Model } from "mongoose";
import { Conference } from "../../entities/conference.entity";
import { MongoConference } from "./mongo-conference";
import { IConferenceRepository } from "../../ports/conference-repositiry.interface";

class ConferenceMapper {
    toCore(mondel: MongoConference.ConferenceDocument): Conference {
        return new Conference({
            id: mondel._id,
            organizerId: mondel.organizerId,
            title: mondel.title,
            seats: mondel.seats,
            startDate: mondel.startDate,
            endDate: mondel.endDate,
        });
    }

    toPersistence(conference: Conference): MongoConference.ConferenceDocument {
        return new MongoConference.ConferenceModel({
            _id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            seats: conference.props.seats,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
        });
    }
}

export class MongoConferenceRepository implements IConferenceRepository {
    private readonly mapper = new ConferenceMapper();
    constructor(
        private readonly model: Model<MongoConference.ConferenceDocument>
    ) {}

    async create(conference: Conference): Promise<void> {
        const record = this.mapper.toPersistence(conference);

        await record.save();
    }

    async findById(id: string): Promise<Conference | null> {
        const conference = await this.model.findById({ _id: id });
        if (!conference) return null;

        return this.mapper.toCore(conference);
    }

    async update(conference: Conference): Promise<void> {
        await this.model.updateOne(
            { _id: conference.props.id },
            { $set: conference.props, $currentDate: { lastModified: true } }
        );
    }
}
