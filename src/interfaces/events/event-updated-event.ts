import { Topics } from "../";
import { BannerTemplate, ThumbnailTemplate } from "../common";
import mongoose from 'mongoose';
import { EventOthers, EventPayment, EventTicketCost, EventVisibility, Featuring, Guest } from "../event";

export interface EventUpdatedEvent {
    topic: Topics.EVENT_UPDATED;
    data: {
        id: string;
        version: number;
        videos?: mongoose.Types.ObjectId[];
        name?: string;
        startTime?: Date;
        endTime?: Date;
        type?: string;
        venue?: string; // mongoose objectId string
        description?: string;
        category?: string;
        thumbnail?: ThumbnailTemplate;
        banner?: BannerTemplate;
        host: mongoose.Types.ObjectId;
        coHosts?: mongoose.Types.ObjectId[];
        audiences?: mongoose.Types.ObjectId[];
        featuring?: Featuring[];
        guests?: Guest[]; // guests is required when isPrivate is true.
        ticketCost?: EventTicketCost;
        approvedChannelId?: mongoose.Types.ObjectId;
        isPaymentRequired?: boolean;
        attendees?: mongoose.Types.ObjectId[];
        visibility?: EventVisibility;
        others?: EventOthers;
        hasEventStarted?: boolean;
        payment?: EventPayment;
        orderBooked?: number;
        isDeleted?: boolean;
        creationDate?: Date;
        lastModifiedDate?: Date;
    };
};
