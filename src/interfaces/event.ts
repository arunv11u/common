import { Currency, OtherCategory, OtherCategorySubSchema } from "./common";
import mongoose from 'mongoose';
import { MongooseSchemaService } from "../services";

const mongooseSchemaService = MongooseSchemaService.getInstance();


export enum EventThumbnailConvertedFilenames {
    WEB_240 = "240xh.webp",
    WEB_480 = "480xh.webp",
    WEB_720 = "720xh.webp",
    WEB_970 = "970xh.webp",
    WEB_1920 = "1920xh.webp",

    MOBILE_240 = "wx240.webp",
    MOBILE_480 = "wx480.webp",
    MOBILE_720 = "wx720.webp",
    MOBILE_970 = "wx970.webp",
    MOBILE_1920 = "wx1920.webp"
};

export enum EventBannerConvertedFilenames {
    WEB_240 = "240xh.webp",
    WEB_480 = "480xh.webp",
    WEB_720 = "720xh.webp",
    WEB_970 = "970xh.webp",
    WEB_1920 = "1920xh.webp",

    MOBILE_240 = "wx240.webp",
    MOBILE_480 = "wx480.webp",
    MOBILE_720 = "wx720.webp",
    MOBILE_970 = "wx970.webp",
    MOBILE_1920 = "wx1920.webp"
};

export interface Featuring {
    user: mongoose.Types.ObjectId;
    role: string;
    profilePic: string;
    description: string;
};

export interface Guest {
    email: string;
};

export interface EventTicketCost {
    price: number;
    currency: Currency;
    hasGuestPayment: boolean;
};

export interface EventOthers extends mongoose.Document {
    category?: OtherCategory;
};

export interface VenueDoc extends mongoose.Document {
    label: string;
    value: string;
};

export interface EventPayment extends mongoose.Document {
    productId: string;
    priceId: string;
    platformChargesInPercent: number;
    chargeId?: string
};

export enum EventVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
};

export const featuringSubSchema = new mongoose.Schema<Featuring, any>({
    user: { type: mongoose.Types.ObjectId, required: [true, 'is a required field'] },
    role: { type: String, required: [true, 'is a required field'] },
    profilePic: { type: String, required: [true, 'is a required field'] },
    description: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

export const guestSubSchema = new mongoose.Schema<Guest, any>({
    email: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

export const eventCostSubSchema = new mongoose.Schema<EventTicketCost, any>({
    price: { type: Number, required: [true, 'is a required field'] }, //! Note: cents. (minimum value will be stored here for all possible currencies)
    currency: { type: String, enum: Currency, required: [true, 'is a required field'] },
    hasGuestPayment: { type: Boolean, default: false, required: [true, 'is a required field'] }
}, { _id: false });

export const eventOthersSubSchema = new mongoose.Schema<EventOthers, any>({
    category: { type: OtherCategorySubSchema }
}, { _id: false });

export const venueSchema = new mongoose.Schema<VenueDoc, any>({
    _id: { type: String, required: [true, 'is a required field'] },
    label: { type: String, required: [true, 'is a required field'] },
    value: { type: String, required: [true, 'is a required field'] }
}, { toJSON: { transform: mongooseSchemaService.transform } });

export const eventPaymentSchema = new mongoose.Schema<EventPayment, any>({
    productId: { type: String, required: [true, 'is a required field'] },
    priceId: { type: String, required: [true, 'is a required field'] },
    platformChargesInPercent: { type: Number, required: [true, 'is a required field'] },
    chargeId: { type: String }
}, { _id: false, id: false, toJSON: { transform: mongooseSchemaService.transform } });
