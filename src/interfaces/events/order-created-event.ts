import { Topics } from "../";
import mongoose from 'mongoose';
import { EventbookingStatus, OrderTypes } from "../order";
import { TransactionApprovedChannel, TransactionEvent, TransactionUser } from "../transaction";

export interface OrderCreatedEvent {
    topic: Topics.ORDER_CREATED;
    data: {
        id: string;
        version: number;
        user: TransactionUser;
        event: TransactionEvent;
        type: OrderTypes;
        status: EventbookingStatus;
        orderId: string;
        approvedChannel?: TransactionApprovedChannel;
        transactionId?: mongoose.Types.ObjectId;
        isDeleted?: boolean;
        creationDate?: Date;
        lastModifiedDate?: Date;
        createdBy?: mongoose.Types.ObjectId;
        updatedBy?: mongoose.Types.ObjectId;
    };
};
