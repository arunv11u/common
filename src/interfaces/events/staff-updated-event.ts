import { Topics } from "../";
import { Contact } from "../common";
import { UserStatus } from "../user";

export interface StaffUpdatedEvent {
    topic: Topics.STAFF_UPDATED;
    data: {
        id: string;
        version: number;
        ssoId?: string;
        status?: UserStatus;
        role?: string;
        displayName?: string;
        firstName?: string;
        lastName?: string;
        profilePic?: string;
        department?: string;
        contact?: Contact;
        empId?: string;
        email?: string;
        isDeleted?: boolean;
        creationDate?: Date;
        lastModifiedDate?: Date;
    };
};
