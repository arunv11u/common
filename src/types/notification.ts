import mongoose from 'mongoose';

interface FCMMessage {
    title: string;
    body: string;
};

enum NotificationTypes {
    WELCOME = "WELCOME",
    BOOKING_CONFIRM = "BOOKING_CONFIRM",
    BOOKING_CANCEL = "BOOKING_CANCEL",
    EVENT_REMINDER = "EVENT_REMINDER",
    HOST_EVENT_CANCEL = "HOST_EVENT_CANCEL",
    CHANNEL_APPLICATION = "CHANNEL_APPLICATION",
    CHANNEL_REVIEW = "CHANNEL_REVIEW",
    CHANNEL_CONFIRMATION = "CHANNEL_CONFIRMATION",
    CHANNEL_REJECTION = "CHANNEL_REJECTION",
    CHANNEL_DELETION = "CHANNEL_DELETION",
    FRIEND_REQUEST = "FRIEND_REQUEST",
    FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED"
};

interface NotificationSender {
    user?: mongoose.Types.ObjectId;
    channelStaff?: mongoose.Types.ObjectId;
    admin?: mongoose.Types.ObjectId;
    system?: mongoose.Types.ObjectId;
};

interface NotificationReceiver {
    user?: mongoose.Types.ObjectId;
    channelStaff?: mongoose.Types.ObjectId;
    admin?: mongoose.Types.ObjectId;
};

interface NotificationPayload {
    image?: string;
    email?: string;
    eventId?: string;
    channelId?: string;
};

const notificationSenderSubSchema = new mongoose.Schema<NotificationSender, any>({
    user: { type: mongoose.Types.ObjectId, ref: 'users' },
    channelStaff: { type: mongoose.Types.ObjectId, ref: 'channelstaffs' },
    admin: { type: mongoose.Types.ObjectId, ref: 'staffs' },
    system: { type: mongoose.Types.ObjectId, ref: 'notifications' }
}, { _id: false, id: false });

const notificationReceiverSubSchema = new mongoose.Schema<NotificationReceiver, any>({
    user: { type: mongoose.Types.ObjectId, ref: 'users' },
    channelStaff: { type: mongoose.Types.ObjectId, ref: 'channelstaffs' },
    admin: { type: mongoose.Types.ObjectId, ref: 'staffs' },
}, { _id: false, id: false });

const notificationPayloadSubSchema = new mongoose.Schema<NotificationPayload & { id: string; }, any>({
    id: { type: String, required: [true, 'is a required field'] },
    image: { type: String },
    email: { type: String },
    eventId: { type: String },
    channelId: { type: String }
}, { _id: false, id: false });

export {
    FCMMessage,
    NotificationTypes,
    NotificationSender,
    NotificationReceiver,
    NotificationPayload,
    notificationSenderSubSchema,
    notificationReceiverSubSchema,
    notificationPayloadSubSchema
};
