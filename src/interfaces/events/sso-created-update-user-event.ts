import { Topics } from "../";
import { UserStatus } from "../user";

export interface SSOCreatedUpdateUserEvent {
    topic: Topics.SSO_CREATED_UPDATE_USER;
    data: {
        id: string;
        version: number;
        ssoId: string;
        status: UserStatus;
        onboardingStatus: number;
        role: string;
        displayName: string;
        firstName: string;
        lastName: string;
        email: string;
        isDeleted: boolean;
        lastModifiedDate: Date;
    };
};
