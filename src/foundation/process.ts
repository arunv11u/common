import { GenericValidationError } from "..";
import { Winston } from "./";

export abstract class ProcessListener {
    constructor() { };

    abstract onListener(process: NodeJS.Process, winston: Winston): void;
};
export class UnHandledAndUnCaught extends ProcessListener {
    private static _instance: UnHandledAndUnCaught;
    private static isExceptionSet: boolean = false;


    private constructor() {
        super();
    };

    static getInstance(): UnHandledAndUnCaught {
        if (!UnHandledAndUnCaught._instance) UnHandledAndUnCaught._instance = new UnHandledAndUnCaught();

        return UnHandledAndUnCaught._instance;
    };

    onListener(process: NodeJS.Process) {
        try {
            if (!UnHandledAndUnCaught.isExceptionSet) {
                process.on('unhandledRejection', (reason, p) => {
                    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
                });

                process.on('uncaughtException', function (exception) {
                    console.error(exception); // To see your exception details in the console
                });
            } else throw new GenericValidationError({ error: new Error(`Unhandled rejections and Uncaught exceptions listeners are already set`), errorCode: 500 });
        } catch (error) {
            throw error;
        };
    }
};