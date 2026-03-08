import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
    title: string;
    subjectCode: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions: {
        q: string;
        options: string[];
        ans: number;
        explanation: string;
        bloomsLevel?: string;
        type: string;
        marks: number;
    }[];
    createdBy: mongoose.Types.ObjectId; // Teacher
}

const QuizSchema: Schema = new Schema({
    title: { type: String, required: true },
    subjectCode: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    questions: [{
        q: { type: String, required: true },
        options: [{ type: String }],
        ans: { type: Number, required: true },
        explanation: { type: String },
        bloomsLevel: { type: String },
        type: { type: String, default: 'mcq' },
        marks: { type: Number, default: 1 }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
