import { NextFunction, Request, Response } from "express";
import { Query, Params } from 'express-serve-static-core';


interface InputValidations {
    validate: (request: Request, response: Response, next: NextFunction) => {};
};

interface TypedRequest<P extends Params, T extends Query, U> extends Express.Request {
    query: T;
    body: U;
    params: P;
};

interface TypedResponse<B, L> extends Response {
    body: B;
    locals: L;
};

export {
    InputValidations,
    TypedRequest,
    TypedResponse
};
