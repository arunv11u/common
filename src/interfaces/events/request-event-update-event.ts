import { Topics } from "../";
import mongoose from 'mongoose';
import { BannerTemplate, ThumbnailTemplate } from "../common";
import { EventOthers, EventPayment, EventTicketCost, EventVisibility, Featuring, Guest } from "../event";

export interface RequestEventUpdateEvent {
    topic: Topics.REQUEST_EVENT_UPDATE;
    data: {
        id: string;
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
        orderConfirmation?: boolean;
        orderCancellation?: boolean;
    };
};
