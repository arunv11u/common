import { Topics } from "../";


export interface EventReminderEvent {
    topic: Topics.EVENT_REMINDER;
    data: {
        id: string;
    };
};
