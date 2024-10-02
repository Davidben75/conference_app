import {
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    MIN,
} from "class-validator";

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
