import nconf from 'nconf';
import { Environment } from '../';
import { GenericValidationError } from '../errors';

export type NCONF = typeof nconf;

export interface DefaultConfig {
    prodConfig: Record<string, any>;
    stagingConfig?: Record<string, any>;
    devConfig?: Record<string, any>;
    testConfig?: Record<string, any>;
};


export abstract class Config  {
    constructor() {};

    // abstract set nconf(nconf:NCONF);
    abstract get nconf(): NCONF;
    abstract set(environment: Environment, config: DefaultConfig): void; 
}

export class Nconf extends Config {
    private static _instance: Nconf;
    private _nconf: NCONF = nconf;
    private isRequired: boolean = false;

    private constructor() {
        super();
    }

    // set nconf(nconf: any) {
    //     if (!this._nconf) this._nconf = nconf;
    // };

    get nconf() {
        if(!this.isRequired) throw new GenericValidationError({error: new Error(`Cannot get nconf without setting it up`), errorCode: 500});
        return this._nconf;
    };

    static getInstance(): Nconf {
        if (!Nconf._instance) Nconf._instance = new Nconf();

        return Nconf._instance;
    };

    set(environment: Environment, config: DefaultConfig) {
        try {
            this.isRequired = true;
            let data = {};
            if (environment === Environment.PRODUCTION) {
                data = {
                    ...config.prodConfig
                };
            } else if (environment === Environment.STAGING) {
                data = {
                    ...config.stagingConfig
                };
            } else if (environment === Environment.DEV) {
                data = {
                    ...config.devConfig
                };
            } else if (environment === Environment.TEST) {
                data = {
                    ...config.testConfig
                };
            } else {
                data = {
                    ...config.prodConfig,
                };
            }

            this._nconf.argv().env().add('data', { type: 'literal', store: data });
        } catch (error) {
            throw error;
        };
    };
};