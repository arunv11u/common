import express from 'express';
import { GenericValidationError } from '../errors';
import { TypedResponse } from '../types';


class BaseResponse<T> {
    data: T | null = null;
};

interface BaseResponseHandler {
    ok<T>(response: express.Response, data?: T): express.Response<BaseResponse<T>>;
    created<T>(response: express.Response): express.Response<BaseResponse<T>>;
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

    ok<ResBody, Locals>(response: TypedResponse<BaseResponse<ResBody>, Locals>, data?: ResBody): express.Response<BaseResponse<ResBody>> {
        try {
            if (!data) return response.status(200).send({ data: null });

            response.type('application/json');
            return response.status(200).send({ data });
        } catch (error) {
            throw error;
        }
    };

    created<ResBody, Locals>(response: TypedResponse<BaseResponse<ResBody>, Locals>, data?: ResBody): express.Response<BaseResponse<ResBody>> {
        if (!data) return response.status(201).send({ data: null});

        response.type('application/json');
        return response.status(201).send({ data });
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
