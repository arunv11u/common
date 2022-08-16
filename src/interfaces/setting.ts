import mongoose from 'mongoose';

export interface StripeSetting {
    apiKey: string;
    apiVersion: string;
    webhookEndpoint: string;
    platformChargesInPercent: number;
    cancelationChargesInPercent: number;
    // connectAccountId: string;
};

export interface EmailSetting {
    apiKey: string;
    welcomeStaffId: string;
    inviteStaffId: string;
    welcomeChannelStaffId: string;
    inviteChannelStaffId: string;
    welcomeUserId: string;
    inviteUserId: string;
    eventCanceledByHostId: string;
    eventCanceledByUserId: string;
    userBecomeCitizenId: string;
    channelApprovedId: string;
    channelNMDId: string;
    channelRejectedId: string;
    supportId: string;
};

export const stripeSettingSubSchema = new mongoose.Schema<StripeSetting, any>({
    apiKey: { type: String, required: [true, 'is a required field'] },
    apiVersion: { type: String, required: [true, 'is a required field'] },
    webhookEndpoint: { type: String, required: [true, 'is a required field'] },
    platformChargesInPercent: { type: Number, required: [true, 'is a required field'] },
    cancelationChargesInPercent: { type: Number, required: [true, 'is a required field'] },
    // connectAccountId: { type: String, required: [true, 'is a required field'] }
}, { _id: false, id: false });

export const emailSettingSubSchema = new mongoose.Schema<EmailSetting, any>({
    apiKey: { type: String, required: [true, 'is a required field'] },
    welcomeStaffId: { type: String, required: [true, 'is a required field'] },
    inviteStaffId: { type: String, required: [true, 'is a required field'] },
    welcomeChannelStaffId: { type: String, required: [true, 'is a required field'] },
    inviteChannelStaffId: { type: String, required: [true, 'is a required field'] },
    welcomeUserId: { type: String, required: [true, 'is a required field'] },
    inviteUserId: { type: String, required: [true, 'is a required field'] },
    eventCanceledByHostId: { type: String, required: [true, 'is a required field'] },
    eventCanceledByUserId: { type: String, required: [true, 'is a required field'] },
    userBecomeCitizenId: { type: String, required: [true, 'is a required field'] },
    channelApprovedId: { type: String, required: [true, 'is a required field'] },
    channelNMDId: { type: String, required: [true, 'is a required field'] },
    channelRejectedId: { type: String, required: [true, 'is a required field'] },
    supportId: { type: String, required: [true, 'is a required field'] },
}, { _id: false, id: false });