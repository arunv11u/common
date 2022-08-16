import mongoose from 'mongoose';

export interface CountryState extends mongoose.Document {
    name: String;
    code?: String;
    subdivision?: String;
};

export const countryStateSubSchema = new mongoose.Schema<CountryState, any>({
    name: { type: String, required: [true, 'is a required field'] },
    code: { type: String },
    subdivision: { type: String }
}, { _id: false, id: false });

