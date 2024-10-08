import mongoose, { Document, Schema } from "mongoose";
export namespace MongoConference {
    export const CollectionName = "conferences";

    export interface ConferenceDocument extends Document {
        _id: string;
        organizerId: string;
        title: string;
        seats: number;
        startDate: Date;
        endDate: Date;
    }

    export const ConferenceSchema = new Schema<ConferenceDocument>({
        _id: { type: String, required: true },
        organizerId: { type: String, required: true },
        title: { type: String, required: true },
        seats: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    });

    export const ConferenceModel = mongoose.model<ConferenceDocument>(
        CollectionName,
        ConferenceSchema
    );
}
