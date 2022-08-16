import { Topics } from "../";
import mongoose from 'mongoose';
import { TransactionType } from "aws-sdk/clients/lakeformation";
import { DisbursementTransactions, TransactionAccountDetails, TransactionApprovedChannel, TransactionChannelStaff, TransactionDisbursementStatus, TransactionEvent, TransactionRefund, TransactionRefundStatus, TransactionStripeDisbursementStatus, TransactionStripePaymentStatus, TransactionStripeRefundStatus, TransactionSubType, TransactionUser } from "../transaction";

export interface TransactionCreatedEvent {
    topic: Topics.TRANSACTION_CREATED;
    data: {
        id: string;
        version: number;
        type: TransactionType;
        subType: TransactionSubType;
        description: string;
        status: TransactionStripePaymentStatus | TransactionStripeDisbursementStatus | TransactionStripeRefundStatus;
        user?: TransactionUser;
        event: TransactionEvent;
        orderId?: mongoose.Types.ObjectId;
        disbursementTransactions?: DisbursementTransactions[];
        accountDetails?: TransactionAccountDetails;
        approvedChannel?: TransactionApprovedChannel;
        channelStaff?: TransactionChannelStaff;
        disbursementStatus?: TransactionDisbursementStatus;
        refundStatus?: TransactionRefundStatus;
        refund?: TransactionRefund;
        isDeleted: boolean;
        creationDate: Date;
        lastModifiedDate: Date;
    };
};
