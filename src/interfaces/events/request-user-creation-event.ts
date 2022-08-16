import { Topics } from "../";
import { UserStatus } from "../user";

export interface RequestUserCreationEvent {
    topic: Topics.REQUEST_USER_CREATION;
    data: {
        ssoId?: string;
        status: UserStatus;
        onboardingStatus?: number;
        role: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        email: string;
        isDeleted: boolean;
        creationDate: Date;
        lastModifiedDate: Date;
    };
};
