import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
    title: string;
    subjectCode: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions: {
        questionText: string;
        options: string[];
        correctIndex: number;
        explanation: string;
        marks: number;
    }[];
    createdBy: mongoose.Types.ObjectId; // Teacher
}

const QuizSchema: Schema = new Schema({
    title: { type: String, required: true },
    subjectCode: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true },
        explanation: { type: String }, // For auto-grading feedback
        marks: { type: Number, default: 1 }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
