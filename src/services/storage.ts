import { S3 } from 'aws-sdk';
import { ResponseHandler } from '../helpers';
import { S3StorageConnect, Nconf } from '../foundation';

export abstract class CommonStorageService extends ResponseHandler {

    constructor() {
        super();
    };

    abstract getFileURLFromKey(key: string): string;
    abstract getSignedURL(key: string, expires?: string, objType?: 'getObject' | 'putObject', uploadId?: string, partNumber?: number): Promise<string>;
    abstract getObjectKey(fileURL: string): string;
    abstract addObjectLock(key: string): Promise<S3.PutObjectLegalHoldOutput>;
    abstract removeObjectLock(key: string): Promise<S3.PutObjectLegalHoldOutput>;
    abstract getObject(key: string): Promise<S3.Body | undefined>;
    abstract putObject(key: string, body: Buffer): Promise<S3.PutObjectOutput>;
    abstract putObjectTagging(key: string, tagSet: S3.TagSet): Promise<S3.PutObjectTaggingOutput>;
    abstract createMultipartUpload(key: string): Promise<S3.CreateMultipartUploadOutput>;
    abstract listParts(key: string, uploadId: string, partNumberMarker?: number, maxParts?: number): Promise<S3.ListPartsOutput>;
    abstract upload(key: string, body: Buffer): Promise<S3.PutObjectOutput>;
};

export abstract class BaseStorageService extends CommonStorageService {
    private _s3StorageConnect: S3StorageConnect;
    private _storage: S3;
    private _nconf: Nconf;

    constructor() {
        super();

        this._s3StorageConnect = S3StorageConnect.getInstance();
        this._storage = this._s3StorageConnect.storage;
        this._nconf = Nconf.getInstance();
    };

    abstract getFilePath<FileType, FileSubType>(access: 'public' | 'private', fileSubType: FileSubType, fileType: FileType, extension: string, userIdObj: Record<string, any> | null): string;
    abstract returnMimeType(fileURL: string): string;
    abstract returnExtension(mimeType: string): string;

    // private _streamToString(stream: any): Promise<ArrayBuffer> {
    //     return new Promise((resolve, reject) => {
    //         const chunks: any[] = [];
    //         stream.on('data', (chunk: any) => chunks.push(chunk));
    //         stream.on('error', reject);
    //         stream.on('end', () => {
    //             return resolve(Buffer.concat(chunks));
    //         });
    //     });
    // }

    /**
     * Get file URL from object key.
     * @param key 
     * @returns string
     */
    getFileURLFromKey(key: string): string {
        return `${this._s3StorageConnect.baseFilePath}${key}`;
    };


    /**
     * 
     * @param key example path : 'output.zip'
     * @param expires 
     * @param objType
     * @param uploadId
     * @param partNumber 
     * @description To get signedURL for viewing and updating an object.
     * @returns Promise<string>
     */
    async getSignedURL(key: string, expires = this._nconf.nconf.get('getSignedURLExpiry'), objType: 'getObject' | 'putObject' | 'uploadPart' = 'getObject', uploadId?: string, partNumber?: number) {
        const signedURLRes = await this._storage.getSignedUrlPromise(objType, {
            Bucket: this._s3StorageConnect.bucketName,
            Key: key,
            Expires: expires,
            UploadId: uploadId,
            PartNumber: partNumber
        });

        return signedURLRes;
    };

    /**
     * 
     * @param fileURL example: https://s3.terrahost.com/bucketName/public/users/user_id/avatar/model.zip
     * @returns example: public/users/user_id/avatar/model.zip
     */
    getObjectKey(fileURL: string) {
        return fileURL.split(this._s3StorageConnect.baseFilePath)[1];
    };

    /**
     * 
     * @param key example: /public/users/user_id/avatar/model.zip
     * @returns Lock will be added for the particular object.
     */
    addObjectLock(key: string) {
        const promise = new Promise<S3.PutObjectLegalHoldOutput>((resolve, reject) => {
            this._storage.putObjectLegalHold({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                LegalHold: {
                    Status: "ON"
                },
            }, function (err, data) {
                if (err) return reject(err);
                resolve(data);
            });
        });

        return promise;
    };

    /**
     * 
     * @param key example: /public/users/user_id/avatar/model.zip
     * @returns Lock will be removed for the particular object.
     */
    removeObjectLock(key: string) {
        const promise = new Promise<S3.PutObjectLegalHoldOutput>((resolve, reject) => {
            this._storage.putObjectLegalHold({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                LegalHold: {
                    Status: "OFF"
                },
            }, function (err, data) {
                if (err) return reject(err);
                resolve(data);
            });
        });

        return promise;
    };


    async getObject(key: string) {
        const promise = new Promise((resolve, reject) => {
            this._storage.getObject({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
            }, (err, data) => {
                if (err) reject(err);
                console.log('data ::: arrayBuffer ::', data);
                resolve(data);
            });
        });

        const file = await promise as S3.GetObjectOutput;

        return file.Body;
    };

    async putObject(key: string, body: Buffer): Promise<S3.PutObjectOutput> {
        const promise = new Promise((resolve, reject) => {
            this._storage.putObject({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                Body: body
            }, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        return promise as S3.PutObjectOutput;
    };

    async putObjectTagging(key: string, tagSet: S3.TagSet): Promise<S3.PutObjectTaggingOutput> {
        const promise = new Promise<S3.PutObjectTaggingOutput>((resolve, reject) => {
            this._storage.putObjectTagging({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                Tagging: {
                    TagSet: tagSet
                }
            }, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        return promise;
    };

    async createMultipartUpload(key: string) {
        const promise = new Promise<S3.CreateMultipartUploadOutput>((resolve, reject) => {
            this._storage.createMultipartUpload({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key
            }, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        return promise;
    };

    async listParts(key: string, uploadId: string, partNumberMarker?: number, maxParts?: number): Promise<S3.ListPartsOutput> {
        const promise = new Promise<S3.ListPartsOutput>((resolve, reject) => {
            this._storage.listParts({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                UploadId: uploadId,
                PartNumberMarker: partNumberMarker,
                MaxParts: maxParts
            }, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        return promise;
    };

    async completeMultipartUpload(key: string, uploadId: string, parts: S3.CompletedPartList): Promise<S3.CompleteMultipartUploadOutput> {
        const promise = new Promise<S3.CompleteMultipartUploadOutput>((resolve, reject) => {
            this._storage.completeMultipartUpload({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: parts
                }
            }, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        return promise;
    };

    async upload(key: string, body: Buffer): Promise<S3.PutObjectOutput> {
        const promise = new Promise((resolve, reject) => {
            this._storage.upload({
                Bucket: this._s3StorageConnect.bucketName,
                Key: key,
                Body: body
            }, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        return promise as S3.PutObjectOutput;
    };

};
