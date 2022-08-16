import { Topics } from "../";
import { ChannelStaffRoles } from "../channel-staff";
import { UserStatus } from "../user";
import mongoose from 'mongoose';

export interface ChannelStaffUpdatedEvent {
    topic: Topics.CHANNEL_STAFF_UPDATED;
    data: {
        id: string;
        version: number;
        // ssoId?: string;
        userId?: mongoose.Types.ObjectId;
        status?: UserStatus;
        // profilePic?: string;
        role?: ChannelStaffRoles;
        // firstName?: string;
        // lastName?: string;
        // displayName?: string;
        email?: string;
        // contact?: {
        //     code: string;
        //     number: string;
        // };
        // internationalNumber?: string;
        approvedChannelId: mongoose.Types.ObjectId;
        isDeleted?: boolean;
        lastModifiedDate?: Date;
    };
};
