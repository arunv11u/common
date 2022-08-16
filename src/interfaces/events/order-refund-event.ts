import { Topics } from "../";
import { TransactionRefund, TransactionStripeRefundStatus } from "../transaction";

export interface OrderRefundEvent {
    topic: Topics.ORDER_REFUND;
    data: {
        id: string;
        version: number;
        status: TransactionStripeRefundStatus;
        refund: TransactionRefund;
    };
};
