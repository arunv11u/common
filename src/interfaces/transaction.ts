import mongoose from 'mongoose';
import { BankAccountCountry, bankAccountCountrySchema } from './bank-account';
import { ChannelStaffRoles } from './channel-staff';
import { eventCostSubSchema, EventPayment, eventPaymentSchema, EventTicketCost } from './event';
import { avatarSchema, UserAvatar } from './user';

export enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
};

export enum TransactionSubType {
    CAPTURE = "CAPTURE",
    REFUND = "REFUND",
    CHANNEL_OWNER_DISBURSEMENT = "CHANNEL_OWNER_DISBURSEMENT",
    OWNER_DISBURSEMENT = "OWNER_DISBURSEMENT"
};

export enum TransactionStripePaymentStatus {
    PAID = "paid",
    UNPAID = "unpaid",
    NO_PAYMENT_REQUIRED = "no_payment_required"
};

export enum TransactionStripeDisbursementStatus {
    PAID = "paid",
    PENDING = "pending",
    IN_TRANSIT = "in_transit",
    CANCELED = "canceled",
    FAILED = "failed"
};

export enum TransactionStripeRefundStatus {
    PENDING = "pending",
    REQUIRES_ACTION = "requires_action",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELED = "canceled"
};

export enum TransactionDisbursementStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
};

export enum TransactionRefundStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
};


export interface TransactionUser extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    displayName: string;
    email: string;
    role: string;
    avatar?: UserAvatar;
};

export interface TransactionEvent extends mongoose.Document {
    eventId: mongoose.Types.ObjectId;
    name: string;
    type: string;
    venue?: string;
    category: string;
    startTime: Date;
    endTime: Date;
    ticketCost?: EventTicketCost;
    payment?: EventPayment;
};

export interface DisbursementTransactions extends mongoose.Document {
    transactionId: mongoose.Types.ObjectId;
    chargeId: string;
    currency: string;
    price: number;
};

export interface TransactionApprovedChannel extends mongoose.Document {
    approvedChannelId: mongoose.Types.ObjectId;
    name: string;
};

export interface TransactionChannelStaff extends mongoose.Document {
    channelStaffId: mongoose.Types.ObjectId;
    displayName: string;
    email: string;
    role: ChannelStaffRoles;
    profilePic: string;
};

export interface TransactionAccountDetails extends mongoose.Document {
    // account: BankAccountAccount;
    country: BankAccountCountry;
    // achNumber: string;
    customerId: string;
    bankAccountId: string;
};

export interface TransactionRefund extends mongoose.Document {
    refundId: string;
    currency: string;
    amount: number;
};

export interface TransactionDisbursement extends mongoose.Document {
    disbursementId: string;
    currency: string;
    amount: number;
};

export interface TransactionCharge extends mongoose.Document {
    chargeId: string;
    currency: string;
    amount: number;
};

export const transactionUserSubSchema = new mongoose.Schema<TransactionUser, any>({
    userId: { type: mongoose.Types.ObjectId, ref: 'users', required: [true, 'is a required field'] },
    displayName: { type: String, required: [true, 'is a required field'] },
    email: { type: String, required: [true, 'is a required field'] },
    role: { type: String, required: [true, 'is a required field'] },
    avatar: { type: avatarSchema }
});

export const transactionEventSubSchema = new mongoose.Schema<TransactionEvent, any>({
    eventId: { type: mongoose.Types.ObjectId, ref: 'events', required: [true, 'is a required field'] },
    name: { type: String, required: [true, 'is a required field'] },
    type: { type: String, ref: 'eventtypes', required: [true, 'is a required field'] },
    venue: { type: String },
    category: { type: String },
    startTime: { type: Date, required: [true, 'is a required field'] },
    endTime: { type: Date, required: [true, 'is a required field'] },
    ticketCost: { type: eventCostSubSchema },
    payment: { type: eventPaymentSchema }
});

export const disbursementTransctionsSubSchema = new mongoose.Schema<DisbursementTransactions, any>({
    transactionId: { type: mongoose.Types.ObjectId, ref: 'transactions', required: [true, 'is a required field'] },
    chargeId: { type: String, required: [true, 'is a required field'] },
    currency: { type: String, required: [true, 'is a required field'] },
    price: { type: Number, required: [true, 'is a required field'] }
}, { _id: false, id: false });

export const transactionApprovedChannelSubSchema = new mongoose.Schema<TransactionApprovedChannel, any>({
    approvedChannelId: { type: mongoose.Types.ObjectId, ref: 'approvedchannels', required: [true, 'is a required field'] },
    name: { type: String, required: [true, 'is a required field'] }
}, { _id: false, id: false });


export const transactionChannelStaffSubSchema = new mongoose.Schema<TransactionChannelStaff, any>({
    channelStaffId: { type: mongoose.Types.ObjectId, ref: 'channelstaffs', required: [true, 'is a required field'] },
    displayName: { type: String, required: [true, 'is a required field'] },
    email: { type: String, required: [true, 'is a required field'] },
    role: { type: String, enum: ChannelStaffRoles, required: [true, 'is a required field'] },
    profilePic: { type: String, required: [true, 'is a required field'] }
}, { _id: false, id: false });

export const transactionAccountDetailsSubSchema = new mongoose.Schema<TransactionAccountDetails, any>({
    // account: { type: bankAccountAccountSchema, required: [true, 'is a required field'] },
    country: { type: bankAccountCountrySchema, required: [true, 'is a required field'] },
    // achNumber: { type: String, required: [true, 'is a required field'] },
    customerId: { type: String, required: [true, 'is a required field'] },
    bankAccountId: { type: String, required: [true, 'is a required field'] },
});

export const transactionRefundSubSchema = new mongoose.Schema<TransactionRefund, any>({
    refundId: { type: String, required: [true, 'is a required field'] },
    currency: { type: String, required: [true, 'is a required field'] },
    amount: { type: Number, required: [true, 'is a required field'] }
});

export const transactionDisbursementSubSchema = new mongoose.Schema<TransactionDisbursement, any>({
    disbursementId: { type: String, required: [true, 'is a required field'] },
    currency: { type: String, required: [true, 'is a required field'] },
    amount: { type: Number, required: [true, 'is a required field'] }
});

export const transactionChargeSubSchema = new mongoose.Schema<TransactionCharge, any>({
    chargeId: { type: String, required: [true, 'is a required field'] },
    currency: { type: String, required: [true, 'is a required field'] },
    amount: { type: Number, required: [true, 'is a required field'] }
});

