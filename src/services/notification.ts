import { FCMConnect } from "../foundation";
import firebaseAdmin from 'firebase-admin';
import { FCMMessage, NotificationPayload, NotificationTypes } from "../types";
import { Message } from 'firebase-admin/messaging';
import { GenericValidationError } from "../errors";

const fcmConnect = FCMConnect.getInstance();

interface BaseFCMService {
    getDeepLink(type: NotificationTypes, baseURL: string, payload: NotificationPayload): string;
    sendPushNotification(message: FCMMessage, type: NotificationTypes, token: string, payload: NotificationPayload, imageUrl: string, icon?: string, link?: string, clickAction?: string): Promise<void>;
};

class FCMService implements BaseFCMService {

    private static _instance: BaseFCMService;
    private _fcm: typeof firebaseAdmin;

    private constructor() {
        this._fcm = fcmConnect.fcm;
    };

    static getInstance(): BaseFCMService {
        if (!FCMService._instance) FCMService._instance = new FCMService();

        return FCMService._instance;
    };

    getDeepLink(type: NotificationTypes, baseURL: string, payload: NotificationPayload & { id: string; }): string {
        let deepLink = `${baseURL}`;
        switch (type) {
            case NotificationTypes.WELCOME: {
                deepLink += `/`;
                break;
            };

            case NotificationTypes.BOOKING_CONFIRM: {
                deepLink += `/events/my-bookings`;
                break;
            };

            case NotificationTypes.BOOKING_CANCEL: {
                deepLink += `/`;
                break;
            };

            case NotificationTypes.EVENT_REMINDER: {
                deepLink += `/view-event/${payload.id}`;
                break;
            };

            case NotificationTypes.HOST_EVENT_CANCEL: {
                deepLink += `/`;
                break;
            };

            case NotificationTypes.CHANNEL_APPLICATION: {
                deepLink += `/`;
                break;
            };

            case NotificationTypes.CHANNEL_REVIEW: {
                deepLink += `/channel/${payload.id}`;
                break;
            };

            case NotificationTypes.CHANNEL_CONFIRMATION: {
                deepLink += `/channel/${payload.id}`;
                break;
            };

            case NotificationTypes.CHANNEL_REJECTION: {
                deepLink += `/channel/${payload.id}`;
                break;
            };

            case NotificationTypes.CHANNEL_DELETION: {
                deepLink += `/`;
                break;
            };

            case NotificationTypes.FRIEND_REQUEST: {
                deepLink += `/profile/friends`;
                break;
            };

            case NotificationTypes.FRIEND_REQUEST_ACCEPTED: {
                deepLink += `/profile/friends`;
                break;
            };

            default: {
                throw new GenericValidationError({ error: new Error("Invalid notification type"), errorCode: 500 });
            };
        };

        return deepLink;
    };

    async sendPushNotification(message: FCMMessage, type: NotificationTypes, token: string, payload: NotificationPayload, imageUrl: string, icon?: string, link?: string, clickAction?: string) {

        const payloadJSON = JSON.parse(JSON.stringify(payload));
        console.log("payloadJSON :::", payloadJSON);

        const _message: Message = {
            token,
            notification: {
                title: message.title,
                body: message.body,
                imageUrl
            },
            data: {
                type,
                ...payloadJSON as Record<string, any>
            },
            webpush: {
                fcmOptions: {
                    link
                }
            },
            android: {
                notification: {
                    clickAction, //* "FLUTTER_NOTIFICATION_CLICK"
                }
            },
            apns: {
                fcmOptions: {
                    imageUrl
                }
            }
        };

        await this._fcm.messaging().send(_message);
    };

};

export {
    BaseFCMService,
    FCMService
};