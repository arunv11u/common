import { Topics } from "../";
import { Contact } from "../common";
import { UserStatus } from "../user";

export interface StaffCreatedEvent {
    topic: Topics.STAFF_CREATED;
    data: {
        id: string;
        version: number;
        ssoId: string;
        status: UserStatus; // 'new', 'invited', 'active', 'inactive'.
        role: string;
        displayName: string;
        firstName: string;
        lastName: string;
        profilePic: string;
        department: string;
        contact: Contact;
        empId: string;
        email: string;
        isDeleted: boolean;
        creationDate: Date;
        lastModifiedDate: Date;
    };
};
