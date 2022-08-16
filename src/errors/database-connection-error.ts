import { ErrorObject } from '../interfaces/error';
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error, connecting to the database';
  statusCode = 500;
  constructor() {
    super('Error, connecting to the database');

    // Only because extending from a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  };

  serializeErrors(): ErrorObject[] {
    return [{ message: this.reason }];
  };
};
