import { Topics } from "../";
import { UserStatus } from "../user";

export interface UserCreatedEvent {
    topic: Topics.USER_CREATED;
    data: {
        id: string;
        version: number;
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
