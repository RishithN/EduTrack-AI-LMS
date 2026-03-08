import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizResult extends Document {
    quizId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    score: number;
    total: number;
    completedAt: Date;
}

const QuizResultSchema: Schema = new Schema({
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
