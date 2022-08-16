import { IHeaders } from 'kafkajs';

interface Event {
    topic: Topics;
    data: any;
};

enum Topics {
    USER_CREATED = 'user-created',
    USER_UPDATED = 'user-updated',
    STAFF_CREATED = 'staff-created',
    STAFF_UPDATED = 'staff-updated',
    APPROVED_CHANNEL_UPSERT = 'approved-channel-upsert',
    CHANNEL_STAFF_CREATED = 'channel-staff-created',
    CHANNEL_STAFF_UPDATED = 'channel-staff-updated',
    EVENT_CREATED = 'event-created',
    EVENT_UPDATED = 'event-updated',
    ORDER_CREATED = 'order-created',
    ORDER_UPDATED = 'order-updated',
    ORDER_DELETED = 'order-deleted',
    ORDER_REFUND = 'order-refund',
    CREATE_ORDER_REFUND = 'create-order-refund',
    ORDER_DISBURSEMENT = 'order-disbursement',
    TRANSCODE_STARTED = 'transcode-started',
    STREAM_STARTED = 'stream-started',
    VIDEO_CREATED = 'video-created',
    VIDEO_UPDATED = 'video-updated',
    VIDEO_META_DATA_CREATED = 'video-meta-data-created',
    VIDEO_META_DATA_UPDATED = 'video-meta-data-updated',
    IMAGE_CONVERSION_STARTED = 'image-conversion-started',
    TASK_CREATE = 'task-create',
    TASK_UPDATE = 'task-update',
    TASK_CANCEL = 'task-cancel',
    TRANSACTION_CREATED = 'transaction-created',
    TRANSACTION_UPDATED = 'transaction-updated',
    SSO_CREATED_UPDATE_USER = 'sso-created-update-user',
    CREATE_USER_THRU_CHANNEL_STAFF = 'create-user-thru-channel-staff',
    REQUEST_USER_CREATION = 'request-user-creation',
    REQUEST_EVENT_UPDATE = 'request-event-update',
    SEND_SAVE_NOTIFICATION = 'send-save-notification',
    SEND_EMAIL = 'send-email',
    EVENT_REMINDER = 'event-reminder',
    USER_DELETE_MARKER ='user-delete-marker',
    CHANNEL_STAFF_DELETED = 'channel-staff-deleted',
    USER_DELETED = 'user-deleted'
};

interface CustomProducerMessage<T extends Event> {
    key?: string | null;
    value: T['data'] | null;
    partition?: number;
    headers?: IHeaders;
    timestamp?: string;
};

interface CustomConsumerMessage<T extends Event> {
    key: string | undefined;
    value: T['data'] | null;
    timestamp: string;
    size: number;
    attributes: number;
    offset: string;
    headers?: IHeaders;
};




export {
    Event,
    Topics,
    CustomProducerMessage,
    CustomConsumerMessage
};