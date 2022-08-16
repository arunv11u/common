import mongoose from 'mongoose';

export interface Role {
    id: string;
    label: string;
    value: string;
};

export const roleSchema = new mongoose.Schema({
    label: { type: String, required: [true, 'is a required field'] },
    value: { type: String, required: [true, 'is a required field'] }
}, { _id: false });
