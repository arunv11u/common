import { NextFunction, Response } from "express";
import { Query, Params } from 'express-serve-static-core';



interface InputValidations {
    validate: (request: Express.Request, response: Express.Response, next: NextFunction) => {};
};

interface TypedRequest<P extends Params, Q extends Query, U> extends Express.Request {
    params: P;
    query: Q;
    body: U;
};

interface TypedResponse<ResBody, Locals> extends Response { };

export {
    InputValidations,
    TypedRequest,
    TypedResponse
};
