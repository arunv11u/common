import mongoose from 'mongoose';
import { OtherCategory, OtherCategorySubSchema } from './common';

export enum VideoTypes {
    PRE_RECORDED = 'PRE_RECORDED',
    LIVE = 'LIVE'
};

export interface AudioTracks {
    language: String;
    url?: string;
};

export interface Subtitles {
    language: String;
    url: string;
};


export enum VideoStatus {
    TRANSCODING = "TRANSCODING",
    PUBLISH = "PUBLISH",
    STREAMING = "STREAMING"
};

export enum Visibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    UNLIST = "UNLIST"
};

export enum Classification {
    _360 = "_360",
    _180 = "_180",
    _2D = "_2D"
};

export interface VideoOthers extends mongoose.Document {
    category?: OtherCategory;
};

export interface Stream extends mongoose.Document {
    id: string;
    url: string;
    key: string;
    language: mongoose.Types.ObjectId;
};

export const audioTracksSubSchema = new mongoose.Schema<AudioTracks, any>({
    language: { type: String, ref: 'languages', required: [true, 'is a required field'] },
    url: { type: String, default: "" }
}, { _id: false });

export const subtitlesSubSchema = new mongoose.Schema<Subtitles, any>({
    language: { type: String, ref: 'languages', required: [true, 'is a required field'] },
    url: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

export const videoOthersSubSchema = new mongoose.Schema<VideoOthers, any>({
    category: { type: OtherCategorySubSchema }
}, { _id: false });

export const streamSchema = new mongoose.Schema<Stream, any>({
    id: { type: String, required: [true, 'is a required field'] },
    url: { type: String, required: [true, 'is a required field'] },
    key: { type: String, required: [true, 'is a required field'] },
    language: { type: String, ref: 'languages', required: [true, 'is a required field'] }
}, { _id: false });
