import mongoose from 'mongoose';

export enum ApprovedChannelStateChangeLogStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
};

export interface ApprovedChannelStateChangeStaffDoc extends mongoose.Document {
    displayName: string;
    email: string;
};

export interface ApprovedChannelStateChangeLogsDoc extends mongoose.Document {
    staff: ApprovedChannelStateChangeStaffDoc;
    status: ApprovedChannelStateChangeLogStatus;
    remarks?: string;
    createdOn?: Date;
};

export enum ApprovedChannelBankDetailsStatus {
    NEW = "NEW",
    PARTIAL = "PARTIAL",
    COMPLETED = "COMPLETED"
};

export interface ApprovedChannelPayment extends mongoose.Document {
    platformChargesInPercent: number;
};

// export interface ApprovedChannelAccount extends mongoose.Document {
//     holderName: string;
//     number: string;
// };

export interface ApprovedChannelCountry extends mongoose.Document {
    // name: string;
    isoCode: string;
};

export interface ApprovedChannelBankDetails {
    // account: ApprovedChannelAccount;
    country: ApprovedChannelCountry;
    // achNumber: string;
    customerId: string;
    bankAccountId: string;
    status: ApprovedChannelBankDetailsStatus;
    isVerified: boolean;
};


export const approvedChannelStateChangeStaffSchema = new mongoose.Schema<ApprovedChannelStateChangeStaffDoc, any>({
    displayName: { type: String, required: [true, 'is a required field'] },
    email: { type: String, required: [true, 'is a required field'] }
}, { _id: false });

export const approvedChannelStateChangeLogsSchema = new mongoose.Schema<ApprovedChannelStateChangeLogsDoc, any>({
    staff: { type: approvedChannelStateChangeStaffSchema, required: [true, 'is a required field'] },
    status: { type: String, enum: ApprovedChannelStateChangeLogStatus, required: [true, 'is a required field'] },
    remarks: { type: String },
    createdOn: { type: Date, default: () => new Date(), required: [true, 'is a required field'] }
}, { _id: false });

export const approvedChannelPaymentSchema = new mongoose.Schema<ApprovedChannelPayment, any>({
    platformChargesInPercent: { type: Number, required: [true, 'is a required field'] }
}, { _id: false, id: false });

// export const approvedChannelAccountSchema = new mongoose.Schema<ApprovedChannelAccount, any>({
//     holderName: { type: String, required: [true, 'is a required field'] },
//     number: { type: String, required: [true, 'is a required field'] }
// }, { _id: false, id: false });

export const approvedChannelCountrySchema = new mongoose.Schema<ApprovedChannelCountry, any>({
    // name: { type: String, required: [true, 'is a required field'] },
    isoCode: { type: String, required: [true, 'is a required field'] }
}, { _id: false, id: false });

export const approvedChannelBankDetailsSchema = new mongoose.Schema<ApprovedChannelBankDetails, any>({
    // account: { type: approvedChannelAccountSchema, required: [true, 'is a required field'] },
    country: { type: approvedChannelCountrySchema, required: [true, 'is a required field'] },
    // achNumber: { type: String, required: [true, 'is a required field'] },
    customerId: { type: String, required: [true, 'is a required field'] },
    bankAccountId: { type: String, required: [true, 'is a required field'] },
    status: { type: String, enum: ApprovedChannelBankDetailsStatus, default: ApprovedChannelBankDetailsStatus.NEW, required: [true, 'is a required field'] },
    isVerified: { type: Boolean, default: false, required: [true, 'is a required field'] }
}, { _id: false, id: false });

