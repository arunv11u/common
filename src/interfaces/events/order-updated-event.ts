import { Topics } from "../";
import mongoose from 'mongoose';
import { EventbookingStatus, OrderTypes } from "../order";
import { TransactionApprovedChannel, TransactionEvent, TransactionUser } from "../transaction";

export interface OrderUpdatedEvent {
    topic: Topics.ORDER_UPDATED;
    data: {
        id: string;
        version: number;
        user?: TransactionUser;
        event?: TransactionEvent;
        type?: OrderTypes;
        status?: EventbookingStatus;
        orderId?: string;
        approvedChannel?: TransactionApprovedChannel;
        transactionId?: mongoose.Types.ObjectId;
        isDeleted?: boolean;
        lastModifiedDate?: Date;
        updatedBy?: mongoose.Types.ObjectId;
    };
};
