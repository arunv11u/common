import { Topics } from "../";

export interface ChannelStaffDeletedEvent {
    topic: Topics.CHANNEL_STAFF_DELETED;
    data: {
        id: string;
        version: number;
    };
};
