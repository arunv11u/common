import { Topics } from "../";
import { NotificationTypes, NotificationSender, NotificationReceiver, NotificationPayload } from '../';

export interface SendSaveNotificationWeb {
    link?: string;
};

export interface SendSaveNotificationAndroid {
    clickAction?: string; 
};

export interface SendSaveNotificationEvent {
    topic: Topics.SEND_SAVE_NOTIFICATION;
    data: {
        id: string;
        // messageType: FCMMessageTypes;
        type: NotificationTypes;
        sender: NotificationSender;
        receiver: NotificationReceiver;
        title: string;
        body: string;
        payload: NotificationPayload;
        web?: SendSaveNotificationWeb;
        android?: SendSaveNotificationAndroid;
        isDeleted: boolean;
        creationDate: Date;
        lastModifiedDate: Date;
    };
};
