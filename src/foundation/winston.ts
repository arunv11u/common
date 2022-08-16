import util from 'util';
import winston from 'winston';
import { Environment } from '../';

export type Winston = typeof winston;

export interface LogPath {
    combinedLogPath: string;
    errorLogPath: string;
};

export abstract class Logger {
    // abstract set winston(winston: Winston);
    abstract get winston(): Winston;
    abstract start(environment: Environment, logPath: LogPath): void;
};

export class WinstonLogger extends Logger {
    private static _instance: WinstonLogger;
    private isRequired: boolean = false;
    private _winston: Winston = winston;

    private constructor() {
        super();
    };


    // set winston(winston: Winston) {
    //     if(!this._winston) this._winston = winston;
    // };

    get winston() {
        if(!this.isRequired) throw {error: new Error(`Cannot get winston without setting it up`), errorCode: 500};
        return this._winston;
    };

    static getInstance(): WinstonLogger {
        if (!WinstonLogger._instance) WinstonLogger._instance = new WinstonLogger();

        return WinstonLogger._instance;
    };

    start(environment: Environment, logPath: LogPath) {
        this.isRequired = true;
        if (!this._winston) throw { error: new Error(`winston must be set before starting the logger`), errorCode: 500 };

        const customConsolePrintf = this._winston.format.combine(
            this._winston.format.colorize(),
            this._winston.format.printf((info: any) => {
                const _info = JSON.parse(JSON.stringify(info));
                delete _info.level;
                delete _info.message;

                const infoObjString = Object.keys(_info).length > 0 ? `${JSON.stringify(_info)}` : '';

                return `${info.level} : ${util.inspect(`${new Date().toString()} : ${info.message} ${infoObjString}`, {
                    colors: true
                })}`;
            })
        );


        const customFilePrintf = this._winston.format.printf((info: any) => {
            const _info = JSON.parse(JSON.stringify(info));
            delete _info.level;
            delete _info.message;

            const infoObjString = Object.keys(_info).length > 0 ? `${JSON.stringify(_info)}` : '';

            return `${util.inspect(`${info.level} : ${new Date().toString()} : ${info.message} ${infoObjString}`, {
                colors: false
            })}`;
        }); // {level: 'info' | 'error', 'debug', message: '', error: "error value" }

        const logger = this._winston.createLogger({
            level: 'silly',
            transports: [
                new this._winston.transports.Console()
            ],
        });

        logger.format = customConsolePrintf;

        // if (environment === Environment.PRODUCTION) {
        //     console.log('production env :::');
        //     logger.format = customFilePrintf;
        //     logger.add(new this._winston.transports.File({
        //         filename: logPath.combinedLogPath,
        //         level: 'error'
        //     }));

        //     logger.add(new this._winston.transports.File({
        //         filename: logPath.errorLogPath,
        //         level: 'silly'
        //     }));
        // };

        this._winston.add(logger);

        if (environment === Environment.PRODUCTION) this._winston.info('IN PRODUCTION MODE');
        else if (environment === Environment.STAGING) this._winston.info('IN STAGING MODE');
        else if (environment === Environment.TEST) this._winston.info('IN TEST MODE');
        else if (environment === Environment.DEV) this._winston.info('IN DEVELOPEMENT MODE');
        else this._winston.info('IN PRODUCTION MODE');
    };
};