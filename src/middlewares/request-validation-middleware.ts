import { Request, Response, NextFunction } from 'express';
import { ObjectSchema, ValidationError } from 'joi';
import { RequestValidationError } from '../errors';

interface RequestValidationMiddleware {
    requestValidate(params: Partial<Record<Segments, ObjectSchema>>): (request: Request, response: Response, next: NextFunction) => {};
};

class RequestValidationMiddleware implements RequestValidationMiddleware {
    private static _instance: RequestValidationMiddleware;

    private constructor() { };

    static getInstance(): RequestValidationMiddleware {
        if (!RequestValidationMiddleware._instance) RequestValidationMiddleware._instance = new RequestValidationMiddleware();

        return RequestValidationMiddleware._instance;
    };

    requestValidate(params: Partial<Record<Segments, ObjectSchema>>) {
        return (request: Request, response: Response, next: NextFunction) => {
            try {
                const err = new ValidateRequestError();

                if (params.body) {
                    const validate = params[Segments.BODY]?.validate(request.body);
                    if (validate?.error) err.details.set(Segments.BODY, validate.error);

                    request.body = validate?.value;
                };

                if (params.cookies) {
                    const validate = params[Segments.COOKIES]?.validate(request.cookies);
                    if (validate?.error) err.details.set(Segments.COOKIES, validate.error);

                    request.cookies = validate?.value;
                };

                if (params.headers) {
                    const validate = params[Segments.HEADERS]?.validate(request.headers);
                    if (validate?.error) err.details.set(Segments.HEADERS, validate.error);

                    request.headers = validate?.value;
                };

                if (params.params) {
                    const validate = params[Segments.PARAMS]?.validate(request.params);
                    if (validate?.error) err.details.set(Segments.PARAMS, validate.error);

                    request.params = validate?.value;
                };

                if (params.query) {
                    const validate = params[Segments.QUERY]?.validate(request.query);
                    if (validate?.error) err.details.set(Segments.QUERY, validate.error);

                    request.query = validate?.value;
                };

                if (params.signedCookies) {
                    const validate = params[Segments.SIGNEDCOOKIES]?.validate(request.signedCookies);
                    if (validate?.error) err.details.set(Segments.SIGNEDCOOKIES, validate.error);

                    request.signedCookies = validate?.value;
                };

                if (err.details.size) throw err;

                return next();

            } catch (error) {
                return next(error);
            };
        };
    };
};

const isRequestValidationError = (err: any) => {
    return err instanceof ValidateRequestError
};

const requestValidationHandler = async function (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    if (!isRequestValidationError(err)) {
        return next(err);
    }

    next(new RequestValidationError(err));
};

enum Segments {
    BODY = 'body',
    COOKIES = 'cookies',
    HEADERS = 'headers',
    PARAMS = 'params',
    QUERY = 'query',
    SIGNEDCOOKIES = 'signedCookies', //! cross check signed cookies spelling
};


interface ValidateRequestError {
    details: Map<Segments, ValidationError>
};


class ValidateRequestError implements ValidateRequestError {
    details: Map<Segments, ValidationError> = new Map();
    constructor() { };
};

export {
    RequestValidationMiddleware,
    ValidateRequestError,
    Segments,
    isRequestValidationError,
    requestValidationHandler
};
