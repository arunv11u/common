import { CustomError } from './';
import { ErrorObject } from '../interfaces';

export class StorageConnectionError extends CustomError {
    reason = 'Error, connecting to the cloud storage';
    statusCode = 500;
    constructor() {
        super('Error, connecting to the cloud storage');

        // Only because extending from a built in class
        Object.setPrototypeOf(this, StorageConnectionError.prototype);
    }

    serializeErrors(): ErrorObject[] {
        return [{ message: this.reason }];
    }
};

