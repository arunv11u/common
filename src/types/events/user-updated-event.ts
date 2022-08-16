import { Topics } from "../";
import { UserAvatar, UserStatus } from "../user";

export interface UserUpdatedEvent {
    topic: Topics.USER_UPDATED;
    data: {
        id: string;
        version: number;
        ssoId?: string;
        status?: UserStatus;
        onboardingStatus?: number;
        role?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: UserAvatar;
        isDeleted?: boolean;
        creationDate?: Date;
        lastModifiedDate?: Date;
    };
};
