import { Topics } from "../";

export interface SendEmailEvent {
    topic: Topics.SEND_EMAIL;
    data: {
        email: string;
        data: Record<string, any>;
        template: string;
    };
};
