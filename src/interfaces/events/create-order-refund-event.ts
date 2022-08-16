import { Topics } from "../";

export interface CreateOrderRefundEvent {
    topic: Topics.CREATE_ORDER_REFUND;
    data: {
        id: string;
        version: number;
    };
};
