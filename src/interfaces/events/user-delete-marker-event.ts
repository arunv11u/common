import { Topics } from "../";

export interface UserDeleteMarkerEvent {
    topic: Topics.USER_DELETE_MARKER;
    data: {
        id: string;
        email: string;
    };
};
