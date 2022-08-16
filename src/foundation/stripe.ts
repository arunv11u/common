import Stripe from 'stripe';
import { GenericValidationError } from '../';

export abstract class PaymentConnect {
    constructor() { };

    abstract get stripe(): Stripe;

    abstract set apiKey(apiKey: string);
    abstract set apiVersion(apiVersion: "2020-08-27");

    abstract setConfig(): void;
};

export class StripeConnect extends PaymentConnect {
    private static _instance: StripeConnect;
    private _stripe: Stripe | null = null;
    private _apiKey: string | null = null;
    private _apiVersion: "2020-08-27" | null = null;


    private constructor() {
        super();
    };


    static getInstance(): StripeConnect {
        if (!StripeConnect._instance) StripeConnect._instance = new StripeConnect();

        return StripeConnect._instance;
    };

    get stripe() {
        if (!this._stripe) throw new GenericValidationError({ error: new Error('Cannot get stripe before setting it.'), errorCode: 500 });
        return this._stripe;
    };


    set apiKey(apiKey: string) {
        this._apiKey = apiKey;

        // if (!this._apiKey) this._apiKey = apiKey;
        // else throw new GenericValidationError({ error: new Error('_apiKey cannot be changed once you set it'), errorCode: 500 });
    };

    set apiVersion(apiVersion: "2020-08-27") {
        this._apiVersion = apiVersion;

        // if (!this._apiVersion) this._apiVersion = apiVersion;
        // else throw new GenericValidationError({ error: new Error('_apiVersion cannot be changed once you set it'), errorCode: 500 });
    };

    setConfig() {
        if (!this._apiKey) throw new GenericValidationError({ error: new Error('_apiKey is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._apiVersion) throw new GenericValidationError({ error: new Error('_apiVersion is required to be set before calling setConfig function'), errorCode: 500 });

        this._stripe = new Stripe(this._apiKey, {
            apiVersion: this._apiVersion,
        });
    };
};
