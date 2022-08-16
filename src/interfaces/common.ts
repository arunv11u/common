import { NextFunction, Request, Response } from "express";
import { Query, Params } from 'express-serve-static-core';
import mongoose from 'mongoose';


interface InputValidations {
    validate: (request: Request, response: Response, next: NextFunction) => {}
};

interface TypedRequest<P extends Params, T extends Query, U> extends Express.Request {
    query: T,
    body: U
    params: P
}

interface Date {
    date: string;
    month: string;
    year: string;
};
interface DateAndTime extends Date {
    time: string
};

interface RatioTemplate {
    url: string;
};

interface ThumbnailTemplate {
    web: Thumbnail;
    mobile: Thumbnail;
};

interface Thumbnail {
    original: RatioTemplate;
    cdn: RatioTemplate;
};

interface BannerTemplate {
    web: Banner;
    // mobile: Banner;
};

interface Banner {
    original: RatioTemplate;
    cdn: RatioTemplate;
};

interface Cast {
    name: string;
    role: string;
    profilePic: string;
    description: string;
};

enum Currency {
    USD = "USD"
};

enum Audience {
    MEMBER = "MEMBER",
    CITIZEN = "CITIZEN",
    ELDER = "ELDER"
};

interface OtherCategory extends mongoose.Document {
    name: string;
};

const ratioTemplateSchema = new mongoose.Schema<RatioTemplate, any>({
    url: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

const thumbnailsSubSchema = new mongoose.Schema<Thumbnail, any>({
    original: { type: ratioTemplateSchema, required: [true, 'is a required field'] },
    cdn: { type: ratioTemplateSchema, required: [true, 'is a required field'] }
}, { _id: false });

const bannersSubSchema = new mongoose.Schema<Banner, any>({
    original: { type: ratioTemplateSchema, required: [true, 'is a required field'] },
    cdn: { type: ratioTemplateSchema, required: [true, 'is a required field'] }
}, { _id: false });

const thumbnailTemplateSchema = new mongoose.Schema<ThumbnailTemplate, any>({
    web: { type: thumbnailsSubSchema, required: [true, 'is a required field'] },
    mobile: { type: thumbnailsSubSchema, required: [true, 'is a required field'] }
}, { _id: false });

const bannerTemplateSchema = new mongoose.Schema<BannerTemplate, any>({
    web: { type: bannersSubSchema, required: [true, 'is a required field'] }
    // mobile: { type: bannersSubSchema, required: [true, 'is a required field'] }
}, { _id: false });

const castSubSchema = new mongoose.Schema<Cast, any>({
    name: { type: String, required: [true, 'is a required field'] },
    role: { type: String, required: [true, 'is a required field'] },
    profilePic: { type: String, required: [true, 'is a required field'] },
    description: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

const OtherCategorySubSchema = new mongoose.Schema<OtherCategory, any>({
    name: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

const contactSchema = new mongoose.Schema({
    code: { type: String, required: [true, 'is a required field'] },
    number: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

interface Contact {
    code: string;
    number: string;
};

enum Extensions {
    JPG = "jpg",
    JPEG = "jpeg",
    PNG = "png"
};

enum MimeTypes {
    JPG = "image/jpg",
    JPEG = "image/jpeg",
    PNG = "image/png"
};

enum VideoExtensions {
    MP4 = "mp4",
    MOV = "mov"
};

enum VideoMimeTypes {
    MP4 = "video/mp4",
    QUICKTIME = "video/quicktime"
};

enum SubtitlesExtensions {
    SRT = "srt"
};

enum SubtitlesMimeTypes {
    SRT = "application/x-subrip"
};

enum AudioTracksExtensions {
    MP3 = "mp3"
};

enum AudioTracksMimeTypes {
    MPEG = "audio/mpeg"
};

enum ChunkStatus {
    PENDING = "PENDING",
    INVALID_CHUNK = "INVALID_CHUNK",
    COMPLETED = "COMPLETED"
};

interface Chunk extends mongoose.Document {
    status: ChunkStatus;
    size: number; // In bytes
};

export {
    InputValidations,
    TypedRequest,
    Date,
    DateAndTime,
    RatioTemplate,
    ThumbnailTemplate,
    Thumbnail,
    BannerTemplate,
    Banner,
    Cast,
    ratioTemplateSchema,
    thumbnailsSubSchema,
    bannersSubSchema,
    thumbnailTemplateSchema,
    bannerTemplateSchema,
    castSubSchema,
    Currency,
    Audience,
    OtherCategory,
    OtherCategorySubSchema,
    contactSchema,
    Contact,
    Extensions,
    MimeTypes,
    VideoExtensions,
    VideoMimeTypes,
    SubtitlesExtensions,
    SubtitlesMimeTypes,
    AudioTracksExtensions,
    AudioTracksMimeTypes,
    ChunkStatus,
    Chunk
};
