import { ErrorObject } from "../";
import { ValidateRequestError } from "../middlewares";
import { CustomError } from "./";


export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors: ValidateRequestError) {
        super('Invalid request parameters');

        //It is only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    };

    serializeErrors(): ErrorObject[] {
        const key = this.errors.details.keys().next().value;
        const errData = this.errors.details.get(key);

        if (errData && errData.details[0]) {
            errData.details[0].message = errData.details[0].message.replace(/["]+/g, '');
            return [{ message: errData.details[0].message }];
        } else
            return [
                {
                    message:
                        'Something went wrong, please try again.',
                },
            ];
    };
};
