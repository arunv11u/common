import mongoose from 'mongoose';
import { Chunk, ChunkStatus } from './common';

export interface VideoChunk extends Chunk {
    partNumber: number;
    eTag?: string;
};

export const VideoChunkSchema = new mongoose.Schema<VideoChunk, any>({
    partNumber: { type: Number, required: [true, 'is a required field'] },
    eTag: { type: String, required: [function (this: VideoChunk) { return this.status === ChunkStatus.COMPLETED }, 'is a required field'] },
    size: { type: Number, required: [true, 'is a required field'] },
    status: { type: String, enum: ChunkStatus, required: [true, 'is a required field'] }
}, { _id: false });
