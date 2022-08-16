import { Topics } from "../";
import mongoose from 'mongoose';
import { ApprovedChannelBankDetails, ApprovedChannelPayment } from "../approved-channel";



export interface ApprovedChannelUpsertEvent {
    topic: Topics.APPROVED_CHANNEL_UPSERT;
    data: {
        id: string;
        version: number;
        name: string;
        logo: string;
        channelTypes: string[];
        description: string;
        channelId: string;
        ownedBy: mongoose.Types.ObjectId;
        payment: ApprovedChannelPayment;
        bankDetails?: ApprovedChannelBankDetails;
        isDeleted: boolean;
        creationDate: Date;
        lastModifiedDate: Date;
    };
};
