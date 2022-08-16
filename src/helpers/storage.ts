
export interface BaseStorageHelper {
    getPlainFileURL(fileURL: string): string;
};

export class StorageHelper implements BaseStorageHelper {

    private static _instance: StorageHelper;
    private constructor() { };

    static getInstance(): StorageHelper {
        if (!StorageHelper._instance) StorageHelper._instance = new StorageHelper();

        return StorageHelper._instance;
    };

    /**
     * 
     * @param fileURL example: https://s3.terrahost.com/bucketName/public/users/user_id/avatar/model.zip?someQuery=someValue&someOtherQuery=someOtherValue
     * @returns example: https://s3.terrahost.com/bucketName/public/users/user_id/avatar/model.zip
     */
    getPlainFileURL(fileURL: string) {
        if (!fileURL) return fileURL;

        const url = new URL(fileURL);
        fileURL = url.origin + url.pathname;

        return fileURL;
    };
};
