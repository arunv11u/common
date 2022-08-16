import { Topics } from "..";

export interface StreamStartedEvent {
    topic: Topics.STREAM_STARTED;
    data: {
        streamId: string;
        id: string;
    };
};
