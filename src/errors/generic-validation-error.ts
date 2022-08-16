import { CustomError } from './';
import { ErrorObject, GenericError } from '../interfaces';


export class GenericValidationError extends CustomError {
    statusCode;
    constructor(public errors: GenericError) {
        super(errors.error.message);

        this.statusCode = errors.errorCode;

        Object.setPrototypeOf(this, GenericValidationError.prototype);
    };

    serializeErrors(): ErrorObject[] {
        const { error } = this.errors;
        return [{ message: error.message }];
    };
};
