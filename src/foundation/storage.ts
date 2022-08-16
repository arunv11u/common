import { S3 } from 'aws-sdk';
import { GenericValidationError } from '../';

export abstract class StorageConnect {
    constructor() { };

    abstract get storage(): S3;
    abstract get baseFilePath(): string;
    abstract get bucketName(): string;
    abstract get regionName(): string;
    abstract get accessKeyId(): string;
    abstract get secretAccessKey(): string;
    abstract get protocol(): string;
    abstract get hostname(): string;
    abstract get apiVersion(): string;
    abstract get signatureVersion(): string;
    abstract get forcePathStyle(): boolean;


    abstract set bucketName(bucketName: string);
    abstract set regionName(regionName: string);
    abstract set accessKeyId(accessKeyId: string);
    abstract set secretAccessKey(secretAccessKey: string);
    abstract set protocol(protocol: string);
    abstract set hostname(hostname: string);
    abstract set apiVersion(apiVersion: string);
    abstract set signatureVersion(signatureVersion: string);
    abstract set forcePathStyle(forcePathStyle: boolean);
    abstract setConfig(): void;
};

export class S3StorageConnect extends StorageConnect {
    private static _instance: S3StorageConnect;
    private _storage: S3 | null = null;
    private _bucketName: string | null = null;
    private _regionName: string | null = null;
    private _accessKeyId: string | null = null;
    private _secretAccessKey: string | null = null;
    private _protocol: string | null = null;
    private _hostname: string | null = null;
    private _apiVersion: string | null = null;
    private _signatureVersion: string | null = null;
    private _forcePathStyle: boolean = false;
    private _baseFilePath: string | null = null;


    private constructor() {
        super();
    };


    static getInstance(): S3StorageConnect {
        if (!S3StorageConnect._instance) S3StorageConnect._instance = new S3StorageConnect();

        return S3StorageConnect._instance;
    };

    get storage() {
        if (!this._storage) throw new GenericValidationError({ error: new Error('Cannot get storage before setting it.'), errorCode: 500 });
        return this._storage;
    };

    get baseFilePath() {
        if (!this._baseFilePath) throw new GenericValidationError({ error: new Error('Cannot get _baseFilePath before calling setConfig function'), errorCode: 500 });
        return this._baseFilePath;
    };

    get bucketName() {
        if(!this._bucketName) throw new GenericValidationError({error: new Error(`Cannot get _bucketName before setting it`), errorCode: 500});
        return this._bucketName;
    };

    get regionName() {
        if(!this._regionName) throw new GenericValidationError({error: new Error(`Cannot get _regionName before setting it`), errorCode: 500});
        return this._regionName;
    };

    get accessKeyId() {
        if(!this._accessKeyId) throw new GenericValidationError({error: new Error(`Cannot get _accessKeyId before setting it`), errorCode: 500});
        return this._accessKeyId;
    };

    get secretAccessKey() {
        if(!this._secretAccessKey) throw new GenericValidationError({error: new Error(`Cannot get _secretAccessKey before setting it`), errorCode: 500});
        return this._secretAccessKey;
    };

    get protocol() {
        if(!this._protocol) throw new GenericValidationError({error: new Error(`Cannot get _protocol before setting it`), errorCode: 500});
        return this._protocol;
    };

    get hostname() {
        if(!this._hostname) throw new GenericValidationError({error: new Error(`Cannot get _hostname before setting it`), errorCode: 500});
        return this._hostname;
    };

    get apiVersion() {
        if(!this._apiVersion) throw new GenericValidationError({error: new Error(`Cannot get _apiVersion before setting it`), errorCode: 500});
        return this._apiVersion;
    };

    get signatureVersion() {
        if(!this._signatureVersion) throw new GenericValidationError({error: new Error(`Cannot get _signatureVersion before setting it`), errorCode: 500});
        return this._signatureVersion;
    };

    get forcePathStyle() {
        if(!this._forcePathStyle) throw new GenericValidationError({error: new Error(`Cannot get _forcePathStyle before setting it`), errorCode: 500});
        return this._forcePathStyle;
    };

    set bucketName(bucketName: string) {
        if (!this._bucketName) this._bucketName = bucketName;
        else throw new GenericValidationError({ error: new Error('_bucketName cannot be changed once you set it'), errorCode: 500 });
    };

    set regionName(regionName: string) {
        if (!this._regionName) this._regionName = regionName;
        else throw new GenericValidationError({ error: new Error('_regionName cannot be changed once you set it'), errorCode: 500 });
    };

    set accessKeyId(accessKeyId: string) {
        if (!this._accessKeyId) this._accessKeyId = accessKeyId;
        else throw new GenericValidationError({ error: new Error('_accessKeyId cannot be changed once you set it'), errorCode: 500 });
    };

    set secretAccessKey(secretAccessKey: string) {
        if (!this._secretAccessKey) this._secretAccessKey = secretAccessKey;
        else throw new GenericValidationError({ error: new Error('_secretAccessKey cannot be changed once you set it'), errorCode: 500 });
    };

    set protocol(protocol: string) {
        if (!this._protocol) this._protocol = protocol;
        else throw new GenericValidationError({ error: new Error('_protocol cannot be changed once you set it'), errorCode: 500 });
    };

    set hostname(hostname: string) {
        if (!this._hostname) this._hostname = hostname;
        else throw new GenericValidationError({ error: new Error('_hostname cannot be changed once you set it'), errorCode: 500 });
    };

    set apiVersion(apiVersion: string) {
        if (!this._apiVersion) this._apiVersion = apiVersion;
        else throw new GenericValidationError({ error: new Error('_apiVersion cannot be changed once you set it'), errorCode: 500 });
    };

    set signatureVersion(signatureVersion: string) {
        if (!this._signatureVersion) this._signatureVersion = signatureVersion;
        else throw new GenericValidationError({ error: new Error('_signatureVersion cannot be changed once you set it'), errorCode: 500 });
    };

    set forcePathStyle(forcePathStyle: boolean) {
        if (!this._forcePathStyle) this._forcePathStyle = forcePathStyle;
        else throw new GenericValidationError({ error: new Error('_forcePathStyle cannot be changed once you set it'), errorCode: 500 });
    };

    setConfig() {
        if (!this._bucketName) throw new GenericValidationError({ error: new Error('_bucketName is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._regionName) throw new GenericValidationError({ error: new Error('_regionName is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._accessKeyId) throw new GenericValidationError({ error: new Error('_accessKeyId is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._secretAccessKey) throw new GenericValidationError({ error: new Error('_secretAccessKey is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._protocol) throw new GenericValidationError({ error: new Error('_protocol is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._hostname) throw new GenericValidationError({ error: new Error('_hostname is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._apiVersion) throw new GenericValidationError({ error: new Error('_apiVersion is required to be set before calling setConfig function'), errorCode: 500 });
        if (!this._signatureVersion) throw new GenericValidationError({ error: new Error('_signatureVersion is required to be set before calling setConfig function'), errorCode: 500 });

        if (this._forcePathStyle) this._baseFilePath = `${this._protocol}://${this._hostname}/${this._bucketName}/`;
        else this._baseFilePath = `${this._protocol}://${this._bucketName}.${this._hostname}/`;

        this._storage = new S3({
            region: this._regionName,
            credentials: {
                accessKeyId: this._accessKeyId,
                secretAccessKey: this._secretAccessKey,
            },
            endpoint: `${this._protocol}://${this._hostname}/`,
            apiVersion: this._apiVersion, // 2006-03-01, 2012-10-17
            signatureVersion: this._signatureVersion,
            s3ForcePathStyle: this._forcePathStyle
        });
    };
};
