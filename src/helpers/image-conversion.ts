import { EventBannerConvertedFilenames, EventThumbnailConvertedFilenames, UserAvatarConvertedFilenames } from "../interfaces";

export interface BaseImageConversionHelper {
    getConvertedFileUrl(fileURL: string, convertedFilename: UserAvatarConvertedFilenames | EventThumbnailConvertedFilenames | EventBannerConvertedFilenames): string;
};

export class ImageConversionHelper implements BaseImageConversionHelper {

    private static _instance: ImageConversionHelper;
    private constructor() { };

    static getInstance(): BaseImageConversionHelper {
        if (!ImageConversionHelper._instance) ImageConversionHelper._instance = new ImageConversionHelper();

        return ImageConversionHelper._instance;
    };

    /**
     * 
     * @param fileURL example: https://s3.terrahost.com/bucketName/public/users/user_id/avatar/model.zip
     * @returns example: https://s3.terrahost.com/bucketName/public/users/user_id/avatar/240x240.webp
     */
     getConvertedFileUrl(fileURL: string, convertedFilename: UserAvatarConvertedFilenames | EventThumbnailConvertedFilenames | EventBannerConvertedFilenames): string {
        if (!fileURL) return fileURL;

        const modFileURL = `${fileURL.slice(0, fileURL.lastIndexOf("/"))}/${convertedFilename}`;

        return modFileURL;
    };
};
