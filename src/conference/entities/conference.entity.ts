import { differenceInDays, differenceInHours } from "date-fns";
import { Entity } from "../../core/entities/entity";

type ConferenceProps = {
    id: string;
    organizerId: string;
    title: string;
    startDate: Date;
    endDate: Date;
    seats: number;
};

export class Conference extends Entity<ConferenceProps> {
    public initialState: ConferenceProps;
    public props: ConferenceProps;

    isTooClose(now: Date): boolean {
        return differenceInDays(this.props.startDate, now) < 3;
    }

    hasToManySeats(): boolean {
        return this.props.seats > 1000;
    }

    hasNotEnoughSeats(): boolean {
        return this.props.seats < 20;
    }

    isTooLong(): boolean {
        return differenceInHours(this.props.endDate, this.props.startDate) > 3;
    }
}
