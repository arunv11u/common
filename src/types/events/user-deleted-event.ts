import { Topics } from "../";

export interface UserDeletedEvent {
    topic: Topics.USER_DELETED;
    data: {
        id: string;
        version: number;
    };
};
