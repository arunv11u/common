import { Topics } from "../";
import mongoose from 'mongoose';
import { AudioTracks, Subtitles, VideoOthers, VideoStatus, VideoTypes, Classification, Stream, Visibility } from "../video";
import { BannerTemplate, Cast, ThumbnailTemplate } from "../common";



export interface TranscodeStartedEvent {
    topic: Topics.TRANSCODE_STARTED;
    data: {
        id: string;
        version: number;
        url: string;
        rawURL?: string; //? Optional for live streaming.
        type?: VideoTypes;
        uploadId: string;
        transcodedBy: string;
        libraryId: string;
        stream?: Stream; //? Optional for pre-recorded.
        title: string;
        description: string;
        status?: VideoStatus;
        category: string;
        tags?: string[]; 
        audioTracks?: AudioTracks[]; //? Optional for live streaming
        subtitles?: Subtitles[]; //? Optional for live streaming
        audiences: mongoose.Types.ObjectId[]; //! Change it back to User roles ENUM.
        thumbnail: ThumbnailTemplate;
        banner: BannerTemplate;
        casts?: Cast[]; //? Optional for live streaming
        approvedChannelId: mongoose.Types.ObjectId;
        isScheduled?: boolean;
        releaseDate?: Date; // set default release date as new date
        visibility: Visibility;
        is360?: boolean;
        views?: number;
        others?: VideoOthers;
        classification: Classification;
        isDeleted?: boolean;
        creationDate?: Date;
        lastModifiedDate?: Date;
    };
};
