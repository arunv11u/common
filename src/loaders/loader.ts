import { Express } from 'express';
import { Mongoose } from 'mongoose';
import { ConsumerConfig, ConsumerRunConfig, ProducerConfig } from 'kafkajs';
import { Environment } from '../';
import { GenericValidationError } from '../errors';
import { UnHandledAndUnCaught, Nconf, MongooseConnect, WinstonLogger, DefaultConfig, LogPath, S3StorageConnect, KafkaClient, SSOConnect, StripeConnect, FCMConnect } from '../foundation';
import { CronJob, Routes, BaseLoadModules } from '../interfaces';
import KcAdminClient from 'keycloak-admin';
import { Listener } from '../events';

abstract class BaseLoader {
    abstract set config(config: DefaultConfig);
    abstract set logPath(logPath: LogPath);
    abstract set cronJob(cronJob: CronJob);
    abstract set routes(routes: Routes);
    abstract set app(app: Express);
    abstract set mongoose(mongoose: Mongoose);
    abstract set dbConnectionString(dbConnectionString: string);
    abstract set authUrl(authUrl: string);
    abstract set adminName(adminName: string);
    abstract set adminPassword(adminPassword: string);
    abstract set ssoAuthRefreshTime(minutes: number);
    abstract set clientId(clientId: string);
    abstract set brokers(brokers: string[]);
    abstract set producerConfig(config: ProducerConfig);
    abstract set consumerConfig(config: ConsumerConfig);
    abstract set consumerRunConfig(consumerRunConfig: ConsumerRunConfig);
    abstract set listeners(listeners: Listener<any>[]);

    abstract setup(loadModules: BaseLoadModules): void;
    abstract load(): Promise<boolean>;
};

class Loader extends BaseLoader {
    private static _instance: Loader;
    private _isProcessRequired: boolean = false;
    private _isNconfRequired: boolean = false;
    private _isWinstonRequired: boolean = false;
    private _isDatabaseRequired: boolean = false;
    private _isCronRequired: boolean = false;
    private _isRoutesRequired: boolean = false;
    private _isStorageRequired: boolean = false;
    private _isKafkaClientRequired: boolean = false;
    private _isSSORequired: boolean = false;
    private _isStripeClientRequired: boolean = false;
    private _isNotificationRequired: boolean = false;

    private _environment: Environment = process.env.NODE_ENV as Environment;
    private _config: DefaultConfig | null = null;
    private _logPath: LogPath | null = null;
    private _mongoose: Mongoose | null = null;
    private _dbConnectionString: string | null = null;
    private _authUrl: string | null = null;
    private _adminName: string | null = null;
    private _adminPassword: string | null = null;
    private _ssoGrantType: 'client_credentials' | 'password' | null = null;
    private _ssoClientName: string | null = null;
    private _ssoRealmName: string | null = null;
    private _ssoAuthRefreshTime: number | null = null;
    private _cronJob: CronJob | null = null;
    private _routes: Routes | null = null;
    private _app: Express | null = null;
    private _clientId: string | null = null;
    private _brokers: string[] | null = null;
    private _producerConfig: ProducerConfig | null = null;
    private _consumerConfig: ConsumerConfig | null = null;
    private _consumerRunConfig: ConsumerRunConfig | null = null;
    private _listeners: Listener<any>[] | null = null;

    private constructor() {
        super();
    };

    static getInstance(): Loader {
        if (!Loader._instance) Loader._instance = new Loader();

        return Loader._instance;
    };

    set config(config: DefaultConfig) {
        this._config = config;
    };

    set logPath(logPath: LogPath) {
        this._logPath = logPath;
    };

    set mongoose(mongoose: Mongoose) {
        this._mongoose = mongoose;
    };

    set dbConnectionString(dbConnectionString: string) {
        this._dbConnectionString = dbConnectionString;
    };

    set authUrl(url: string) {
        this._authUrl = url;
    };

    set adminName(name: string) {
        this._adminName = name;
    };

    set adminPassword(password: string) {
        this._adminPassword = password;
    };

    set ssoGrantType(type: 'client_credentials' | 'password') {
        this._ssoGrantType = type;
    };

    set ssoClientName(name: string) {
        this._ssoClientName = name;
    };

    set ssoAuthRefreshTime(minutes: number) {
        this._ssoAuthRefreshTime = minutes;
    };

    set ssoRealmName(name: string) {
        this._ssoRealmName = name;
    };

    set cronJob(cronJob: CronJob) {
        this._cronJob = cronJob;
    };

    set routes(routes: Routes) {
        this._routes = routes;
    };

    set app(app: Express) {
        this._app = app;
    };

    set clientId(clientId: string) {
        this._clientId = clientId;
    };

    set brokers(brokers: string[]) {
        this._brokers = brokers;
    };

    set producerConfig(config: ProducerConfig) {
        this._producerConfig = config;
    };

    set consumerConfig(config: ConsumerConfig) {
        this._consumerConfig = config;
    };

    set consumerRunConfig(consumerRunConfig: ConsumerRunConfig) {
        this._consumerRunConfig = consumerRunConfig;
    };

    set listeners(listeners: Listener<any>[]) {
        this._listeners = listeners;
    };

    setup(loadModules: BaseLoadModules) {
        this._isProcessRequired = loadModules.isProcessRequired;
        this._isNconfRequired = loadModules.isNconfRequired;
        this._isWinstonRequired = loadModules.isWinstonRequired;
        this._isDatabaseRequired = loadModules.isDatabaseRequired;
        this._isCronRequired = loadModules.isCronRequired;
        this._isRoutesRequired = loadModules.isRoutesRequired;
        this._isStorageRequired = loadModules.isStorageRequired;
        this._isKafkaClientRequired = loadModules.isKafkaClientRequired;
        this._isSSORequired = loadModules.isSSORequired;
        this._isStripeClientRequired = loadModules.isStripeClientRequired;
        this._isNotificationRequired = loadModules.isNotificationRequired;
    };

    async load() {
        try {
            // Handling unhandled promise rejections and uncaught exceptions.
            if (this._isProcessRequired) {
                const _process = UnHandledAndUnCaught.getInstance();
                _process.onListener(process);
            };

            // Getting environment variable using nconf.
            if (this._isNconfRequired) {
                if (!this._config) throw new GenericValidationError({ error: new Error(`_config is required to setup the NCONF`), errorCode: 500 });

                const nconf = Nconf.getInstance();
                nconf.set(this._environment, this._config);
            };

            // Server logs are maintained using winston logger.
            if (this._isWinstonRequired) {
                if (!this._logPath) throw new GenericValidationError({ error: new Error(`_logPath is required to setup the winston`), errorCode: 500 });

                const winston = WinstonLogger.getInstance();
                winston.start(this._environment, this._logPath);
            };

            // Connecting DB.
            if (this._isDatabaseRequired) {
                if (!this._dbConnectionString) throw new GenericValidationError({ error: new Error(`_dbConnectionString is required to connect to the db`), errorCode: 500 });
                if (!this._mongoose) throw new GenericValidationError({ error: new Error(`_mongoose is required to connect to the db`), errorCode: 500 });

                const db = MongooseConnect.getInstance();
                db.mongoose = this._mongoose;
                db.dbConnectionString = this._dbConnectionString;
                await db.connect();
            };

            // Connecting SSO Auth.
            if (this._isSSORequired) {
                if (!this._authUrl) throw new GenericValidationError({ error: new Error(`_authUrl is required to authenticate the SSO`), errorCode: 500 });
                if (!this._adminName) throw new GenericValidationError({ error: new Error(`_adminName is required to authenticate the SSO`), errorCode: 500 });
                if (!this._adminPassword) throw new GenericValidationError({ error: new Error(`_adminPassword is required to authenticate the SSO`), errorCode: 500 });
                if (!this._ssoGrantType) throw new GenericValidationError({ error: new Error(`_ssoGrantType is required to authenticate the SSO`), errorCode: 500 });
                if (!this._ssoClientName) throw new GenericValidationError({ error: new Error(`_ssoClientName is required to authenticate the SSO`), errorCode: 500 });
                if (!this._ssoRealmName) throw new GenericValidationError({ error: new Error(`_ssoRealmName is required to authenticate the SSO`), errorCode: 500 });
                if (!this._ssoAuthRefreshTime) throw new GenericValidationError({ error: new Error(`_ssoAuthRefreshTime is required to authenticate the SSO`), errorCode: 500 });

                const sso = SSOConnect.getInstance();
                sso.adminClient = new KcAdminClient({ baseUrl: this._authUrl });
                sso.adminName = this._adminName;
                sso.adminPassword = this._adminPassword;
                sso.ssoGrantType = this._ssoGrantType;
                sso.ssoClientName = this._ssoClientName;
                sso.ssoRealmName = this._ssoRealmName;
                sso.ssoAuthRefreshTime = this._ssoAuthRefreshTime;
                await sso.auth();

                // Refreshing Strategy for SSO (keycloak).
                await sso.refresh();
            }
            // Storage configuration
            if (this._isStorageRequired) {
                const storage = S3StorageConnect.getInstance();
                storage.setConfig();
            };

            // Stripe configuration
            if (this._isStripeClientRequired) {
                const stripe = StripeConnect.getInstance();
                stripe.setConfig();
            };

            // Starting to run cronjobs.
            if (this._isCronRequired) {
                if (!this._cronJob) throw new GenericValidationError({ error: new Error(`_cronJob instance is required to run it`), errorCode: 500 });
                this._cronJob.run();
            };

            // Startup Routes.
            if (this._isRoutesRequired) {
                if (!this._routes) throw new GenericValidationError({ error: new Error(`_routes instance is required to run it`), errorCode: 500 });
                if (!this._app) throw new GenericValidationError({ error: new Error(`_app(Express app instance) is required to listen to the routes`), errorCode: 500 });

                this._routes.listen(this._app);
            };

            // Kafka Client Connection
            if (this._isKafkaClientRequired) {
                const kafkaClient = KafkaClient.getInstance();

                if (!this._clientId) throw new GenericValidationError({ error: new Error('_clientId is need to be set for kafka client connection'), errorCode: 500 });
                if (!this._brokers) throw new GenericValidationError({ error: new Error('_brokers is need to be set for kafka client connection'), errorCode: 500 });

                if (kafkaClient.isConsumerReq && !this._consumerConfig) throw new GenericValidationError({ error: new Error('_consumerConfig is need to be set for kafka client connection'), errorCode: 500 });
                if (kafkaClient.isConsumerReq && !this._listeners) throw new GenericValidationError({ error: new Error('_listeners is need to be set for kafka client connection'), errorCode: 500 });
                if (kafkaClient.isConsumerReq && !this._consumerRunConfig) throw new GenericValidationError({ error: new Error('_consumerRunConfig is need to be set for kafka client connection'), errorCode: 500 });


                kafkaClient.clientId = this._clientId;
                kafkaClient.brokers = this._brokers;


                if (this._producerConfig) kafkaClient.producerConfig = this._producerConfig;
                if (this._consumerConfig) kafkaClient.consumerConfig = this._consumerConfig;
                if (this._listeners) kafkaClient.listeners = this._listeners;
                if (this._consumerRunConfig) kafkaClient.consumerRunConfig = this._consumerRunConfig;

                kafkaClient.init();
                await kafkaClient.onConnect();
                await kafkaClient.onSubscribe();
            };

            // FCM Notification Required
            if (this._isNotificationRequired) {
                const fcmConnect = FCMConnect.getInstance();

                fcmConnect.setConfig();
            };

            return true;
        } catch (error) {
            console.error('Error while starting up server :', error);
            process.exit();
        };
    };

};


export {
    Loader,
    BaseLoader
};
