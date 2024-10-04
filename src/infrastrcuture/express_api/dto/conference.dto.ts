import {
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    MIN,
} from "class-validator";
import { User } from "../../../user/entities/user.entity";

export class CreateConfererenceInputs {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(20)
    seats: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}

export class ChangeSeatsInputs {
    @IsNumber()
    @IsNotEmpty()
    seats: number;
}

export class ChangeDatesInputs {
    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}

export class BookSeatInputs {
    @IsString()
    @IsNotEmpty()
    userId: string;
}

// user, conferenceId, startDate, endDate }: { user: any; conferenceId: any; startDate: any; endDate: any;
