import { NextFunction, Request, Response } from 'express';
import { GenericValidationError } from '..';

export const mongooseServerErrors = (err: any): string => {
    let message = ``;
    switch (err.code) {
        case 11000: {
            if (err.keyValue && Object.keys(err.keyValue)[0])
                message = `${Object.keys(err.keyValue)[0]} already exists, please try again`;
            else
                message = `Some of the provided values already exists, please try again with different values.`;

            break;
        }

        default: {
            message = 'Something went wrong, please try again.';
        }
    };

    return message;
};

export const mongooseValidationErrors = (err: any): string => {
    try {
        const invalidKey = Object.keys(err.errors)[0];
        if (
            err.errors[invalidKey].kind === 'user defined' &&
            err.errors[invalidKey].reason
        )
            throw `${err.errors[invalidKey].path} ${err.errors[invalidKey].reason.message}`;
        else if (
            err.errors[invalidKey].kind === 'user defined' ||
            [
                'enum',
                'required',
                'min',
                'max',
                'minLength',
                'maxLength',
                'match',
            ].some((ele) => err.errors[invalidKey].kind === ele)
        )
            throw `${err.errors[invalidKey].path} ${err.errors[invalidKey].message}`;

        else if (err.errors[invalidKey].kind === 'ObjectId') throw `${err.errors[invalidKey].path} should be an ObjectId but got ${typeof err.errors[invalidKey].value}`;
        else if (err.errors[invalidKey].kind === '[ObjectId]') throw `${err.errors[invalidKey].path} should be an ObjectId but got ${typeof err.errors[invalidKey].value}`;


        return `Something went wrong, please try again.`;
    } catch (error: any) {
        return error;
    };
};

export const mongooseErrorHandler = (err: any, request: Request, response: Response, next: NextFunction) => {
    if (err.name) {
        if (err.name === 'MongoServerError') {
            const message = mongooseServerErrors(err);
            next(new GenericValidationError({ error: new Error(message), errorCode: 400 }));
        } else if (err.name === 'ValidationError') {
            const message = mongooseValidationErrors(err);
            next(new GenericValidationError({ error: new Error(message), errorCode: 400 }));
        } else next(err);
    } else next(err);
};
