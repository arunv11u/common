import { Topics } from "../";

export interface OrderDeletedEvent {
    topic: Topics.ORDER_DELETED;
    data: {
        id: string;
        version: number;
    };
};
