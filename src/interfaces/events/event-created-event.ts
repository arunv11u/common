import { Topics } from "../";
import { BannerTemplate, ThumbnailTemplate } from "../common";
import mongoose from 'mongoose';
import { EventOthers, EventPayment, EventTicketCost, EventVisibility, Featuring, Guest } from "../event";

export interface EventCreatedEvent {
    topic: Topics.EVENT_CREATED;
    data: {
        id: string;
        version: number;
        videos: mongoose.Types.ObjectId[];
        name: string;
        startTime: Date;
        endTime: Date;
        type: string;
        venue?: string;
        description: string;
        category: string;
        thumbnail: ThumbnailTemplate;
        banner: BannerTemplate;
        coHosts: mongoose.Types.ObjectId[];
        host: mongoose.Types.ObjectId;
        audiences: mongoose.Types.ObjectId[];
        featuring: Featuring[];
        guests: Guest[];
        ticketCost?: EventTicketCost;
        approvedChannelId: mongoose.Types.ObjectId;
        isPaymentRequired: boolean;
        attendees: mongoose.Types.ObjectId[];
        visibility: EventVisibility;
        others?: EventOthers;
        hasEventStarted: boolean;
        payment?: EventPayment;
        orderBooked: number;
        isDeleted: boolean;
        creationDate: Date;
        lastModifiedDate: Date;
    };
};
