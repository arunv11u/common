import { Topics } from "../";
import { VideoChunk } from "../video-meta-data";

export interface VideoMetaDataCreatedEvent {
    topic: Topics.VIDEO_META_DATA_CREATED;
    data: {
        id: string;
        version: number;
        uploadId: string;
        url: string;
        chunks?: VideoChunk[];
        totalSize: number;
        isDeleted?: boolean;
        creationDate?: Date;
        lastModifiedDate?: Date;
    };
};
