import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorship extends Document {
    studentId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    status: 'active' | 'completed' | 'pending';
    riskStatus: 'Green' | 'Yellow' | 'Red'; // AI predicted risk indicator
    goals: {
        _id?: mongoose.Types.ObjectId;
        title: string;
        description?: string;
        status: 'pending' | 'in_progress' | 'completed';
        deadline?: Date;
    }[];
    sessions: {
        _id?: mongoose.Types.ObjectId;
        date: Date;
        notes: string;
        actionItems: string[]; // typically AI generated from notes
    }[];
    aiRecommendations: string[]; // AI generated overall study recommendations
    createdAt: Date;
    updatedAt: Date;
}

const MentorshipSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'completed', 'pending'], default: 'active' },
    riskStatus: { type: String, enum: ['Green', 'Yellow', 'Red'], default: 'Green' },
    goals: [{
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
        deadline: { type: Date }
    }],
    sessions: [{
        date: { type: Date, required: true },
        notes: { type: String },
        actionItems: [{ type: String }]
    }],
    aiRecommendations: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IMentorship>('Mentorship', MentorshipSchema);
