import { ClassConstructor, plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

const validationError = async (
    input: any
): Promise<ValidationError[] | false> => {
    const errors = await validate(input, { validationError: { target: true } });
    if (errors.length) return errors;

    return false;
};

export const validatorRequest = async <T>(
    type: ClassConstructor<T>,
    body: any
): Promise<{ errors: boolean | string; input: T }> => {
    const input = plainToClass(type, body);
    console.log(input);
    const errors = await validationError(input);

    if (errors) {
        const errorMessage = errors
            .map((err) => (Object as any).values(err.constraints))
            .join(", ");
        return { errors: errorMessage, input };
    }

    return { errors: false, input };
};
