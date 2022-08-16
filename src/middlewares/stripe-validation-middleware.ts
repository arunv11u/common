
import { NextFunction, Request, Response } from "express";
import Stripe from 'stripe';
import { GenericValidationError } from "../errors";

export const stripeErrorHandler = async (err: Stripe.errors.StripeError,
    req: Request,
    res: Response,
    next: NextFunction) => {

    if(err.type) {
        switch(err.type) {
            case "StripeAPIError": {
                break;
            };

            case "StripeAuthenticationError": {
                break;
            };

            case "StripeCardError": {
                break;
            };

            case "StripeConnectionError": {
                break;
            };

            case "StripeError": {
                break;
            };

            case "StripeIdempotencyError": {
                break;
            };

            case "StripeInvalidGrantError": {
                break;
            };

            case "StripeInvalidRequestError": {
                break;
            };

            case "StripePermissionError": {
                break;
            };

            case "StripeRateLimitError": {
                break;
            };

            case "StripeSignatureVerificationError": {
                break;
            };

            case "StripeSignatureVerificationError": {
                break;
            };

            case "generate": {
                break;
            };

            default: {
                return next(err);
            };
        };
        next(new GenericValidationError({ error: new Error(err.message), errorCode: err.statusCode ? err.statusCode : 500 }));
    } else next(err);
    

};