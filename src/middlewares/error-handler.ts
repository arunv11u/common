import { NextFunction, Request, Response } from "express";
import { ClientSession } from "mongoose";
import { CustomError } from "../errors";
import { WinstonLogger } from "../foundation";
import { FormattedError } from "../types";

export const errorHandler = async (err: Error,
    req: Request,
    res: Response,
    next: NextFunction) => {
    const winston = WinstonLogger.getInstance().winston;

    // Error structure for all services.
    const formattedErrorResponse: FormattedError = {
        errors: [
            {
                message: 'Something went wrong, please try again',
            },
        ],
    };
    const _error = {
        _code: 500,
    };
    if (err instanceof CustomError) {
        // Abort mongo transaction and ending session.
        if (res.locals.session) {
            const session = res.locals.session as ClientSession;
            await session.abortTransaction();
            await session.endSession();
        }

        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    };
    winston.error('Unknown error :', err);

    return res.status(_error._code).send(formattedErrorResponse);

};