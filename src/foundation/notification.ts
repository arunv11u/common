import firebaseAdmin, { credential } from 'firebase-admin';
import { GenericValidationError } from '../';

export abstract class NotificationConnect {
    constructor() { };

    abstract get fcm(): typeof firebaseAdmin;

    abstract set clientEmail(clientEmail: string);
    abstract set privateKey(privateKey: string);
    abstract set projectId(projectId: string);

    
    abstract setConfig(): void;
};

export class FCMConnect extends NotificationConnect {
    private static _instance: NotificationConnect;
    private _clientEmail: string | null = null;
    private _privateKey: string | null = null;
    private _projectId: string | null = null;
    private _isConfigured: boolean = false;


    private constructor() {
        super();
    };


    static getInstance(): NotificationConnect {
        if (!FCMConnect._instance) FCMConnect._instance = new FCMConnect();

        return FCMConnect._instance;
    };

    get fcm() {
        if (!this._isConfigured) throw new GenericValidationError({ error: new Error('Cannot get fcm before configuring it.'), errorCode: 500 });
        return firebaseAdmin;
    };


    set clientEmail(clientEmail: string) {
        this._clientEmail = clientEmail;
    };

    set privateKey(privateKey: string) {
        this._privateKey = privateKey;
    };

    set projectId(projectId: string) {
        this._projectId = projectId;
    };

    setConfig() {
        if (!this._clientEmail) throw new GenericValidationError({ error: new Error('_clientEmail is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._privateKey) throw new GenericValidationError({ error: new Error('_privateKey is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._projectId) throw new GenericValidationError({ error: new Error('_projectId is required to be set before calling setConfig function'), errorCode: 500 });

        this._isConfigured = true;

        firebaseAdmin.initializeApp({
            credential: credential.cert({
                clientEmail: this._clientEmail,
                privateKey: this._privateKey,
                projectId: this._projectId
            })
        });

    };
};
