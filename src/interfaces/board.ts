import mongoose from 'mongoose';

export interface BoardTreasureDoc extends mongoose.Document {
    name: string;
    type: string;
    location: string;
    quantity: number;
};

export const boardTreasureSchema = new mongoose.Schema<BoardTreasureDoc, any>({
    name: { type: String, required: [true, 'is a required field'] },
    type: { type: String, required: [true, 'is a required field'] },
    location: { type: String, required: [true, 'is a required field'] },
    quantity: { type: Number, required: [true, 'is a required field'] }
}, {_id: false});

