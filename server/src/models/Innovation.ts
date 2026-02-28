import mongoose, { Schema, Document } from 'mongoose';

export interface IInnovation extends Document {
    studentId: mongoose.Types.ObjectId;
    studentName: string;
    title: string;
    description: string;
    category?: string;
    status: 'pending' | 'approved' | 'rejected';
    votes: number;
    votedBy: mongoose.Types.ObjectId[];
    comments: { user: string; text: string; date: Date }[];
    feedback?: string;
    submittedAt: Date;
}

const InnovationSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    votes: { type: Number, default: 0 },
    votedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: String, required: true }, // Store name for simplicity or ObjectId
        text: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IInnovation>('Innovation', InnovationSchema);
