import mongoose from 'mongoose';

export enum BankAccountTypes {
    OWNER = "OWNER",
    CHANNEL_OWNER = "CHANNEL_OWNER"
};

export enum BankAccountStatus {
    NEW = "NEW",
    PARTIAL = "PARTIAL",
    COMPLETED = "COMPLETED"
};

// export interface BankAccountAccount extends mongoose.Document {
//     holderName: string;
//     number: string;
// };

export interface BankAccountCountry extends mongoose.Document {
    // name: string;
    isoCode: string;
};

// export const bankAccountAccountSchema = new mongoose.Schema<BankAccountAccount, any>({
//     holderName: { type: String, required: [true, 'is a required field'] },
//     number: { type: String, required: [true, 'is a required field'] }
// }, { _id: false, id: false });

export const bankAccountCountrySchema = new mongoose.Schema<BankAccountCountry, any>({
    // name: { type: String, required: [true, 'is a required field'] },
    isoCode: { type: String, required: [true, 'is a required field'] }
}, { _id: false, id: false });

