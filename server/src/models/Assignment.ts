import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    subjectCode: string; // e.g. CS201
    description: string;
    deadline: Date;
    fileUrl?: string; // Teacher's upload
    createdBy: mongoose.Types.ObjectId; // Teacher
    submissions: {
        studentId: mongoose.Types.ObjectId;
        fileUrl: string;
        submittedAt: Date;
        grade?: number;
        feedback?: string;
    }[];
}

const AssignmentSchema: Schema = new Schema({
    title: { type: String, required: true },
    subjectCode: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    fileUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submissions: [{
        studentId: { type: Schema.Types.ObjectId, ref: 'User' },
        fileUrl: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
        grade: { type: Number },
        feedback: { type: String }
    }]
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
