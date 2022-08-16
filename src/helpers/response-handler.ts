import express from 'express';
import { GenericValidationError } from '../errors';


class BaseResponse<T> {
    data: T | null = null;
};

interface BaseResponseHandler {
    ok<T>(response: express.Response, data?: T): express.Response<BaseResponse<T>>;
    created(response: express.Response): express.Response<undefined>;
    clientError(message?: string): GenericValidationError;
    unauthorized(message?: string): GenericValidationError;
    paymentRequired(message?: string): GenericValidationError;
    forbidden(message?: string): GenericValidationError;
    notFound(message?: string): GenericValidationError
    conflict(message?: string): GenericValidationError;
    tooMany(message?: string): GenericValidationError;
    internalError(message?: string): GenericValidationError;
};

class ResponseHandler implements BaseResponseHandler {

    constructor() { };

    ok<T>(response: express.Response, data?: T): express.Response<BaseResponse<T>> {
        try {
            if (!data) return response.status(200).send({ data: null });

            response.type('application/json');
            return response.status(200).send({ data });
        } catch (error) {
            throw error;
        }
    };

    created(response: express.Response): express.Response<undefined> {
        return response.sendStatus(201);
    };

    clientError(message: string = "Bad Request"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 400 });
    };

    unauthorized(message: string = "Unauthorized"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 401 });
    };

    paymentRequired(message: string = "Payment required"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 402 });
    };

    forbidden(message: string = "Forbidden"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 403 });
    };

    notFound(message: string = "Not found"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 404 });
    };

    conflict(message: string = "Conflict"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 409 });
    };

    tooMany(message: string = "Too many requests"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 429 });
    };

    internalError(message: string = "Internal server error"): GenericValidationError {
        return new GenericValidationError({ error: new Error(message), errorCode: 500 });
    };
};

export {
    BaseResponseHandler,
    ResponseHandler
};
