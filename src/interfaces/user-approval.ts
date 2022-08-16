import mongoose from 'mongoose';
import { MongooseSchemaService } from '../services';

const mongooseSchemaService = MongooseSchemaService.getInstance();


export enum UserApprovalStatus {
    PENDING = "PENDING",
    RECOMMENDED = "RECOMMENDED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
};

export interface UserApprovalRecommendedBy {
    user: string | mongoose.Types.ObjectId;
    status?: UserApprovalStatus;
    recommendedOn?: Date;
};

export interface UserApprovalApprovedBy {
    user: string | mongoose.Types.ObjectId;
    status?: UserApprovalStatus;
    approvedOn?: Date;
};

export interface UserApprovalDoc extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    status?: UserApprovalStatus; // pending, approved.
    recommendedBy: UserApprovalRecommendedBy[];
    approvedBy?: UserApprovalApprovedBy[];
    description: string;
    isDeleted?: boolean;
    creationDate?: Date;
    lastModifiedDate?: Date;
};

export const userApprovalRecommendedBySchema = new mongoose.Schema<UserApprovalRecommendedBy, any>(
    {
        user: { type: mongoose.Types.ObjectId, ref: "users", required: [true, 'is a required field'] },
        status: { type: String, enum: UserApprovalStatus, default: UserApprovalStatus.PENDING, required: [true, 'is a required field']  },
        recommendedOn: { type: Date, required: [true, 'is a required field'] }
    }, { _id: false, toJSON: { transform: mongooseSchemaService.transform } }
);

export const userApprovalApprovedBySchema = new mongoose.Schema<UserApprovalApprovedBy, any>(
    {
        user: { type: mongoose.Types.ObjectId, ref: "staffs", required: [true, 'is a required field'] },
        status: { type: String, enum: UserApprovalStatus, required: [true, 'is a required field']  },
        approvedOn: { type: Date, required: [true, 'is a required field'] }
    }, { _id: false, toJSON: { transform: mongooseSchemaService.transform } }
);
