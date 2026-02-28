import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
    user: mongoose.Types.ObjectId;
    studentId: string;
    department: 'CSE'; // Strictly CSE
    semester: number;
    section: string;
    cgpa: number;
    skills: string[];
    // We can add more fields for Gamification/Innovation Hub later
}

const StudentProfileSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true, unique: true },
    department: { type: String, enum: ['CSE'], default: 'CSE', required: true }, // HARD CONSTRAINT
    semester: { type: Number, required: true, min: 1, max: 8 },
    section: { type: String, required: true },
    cgpa: { type: Number, default: 0 },
    skills: [{ type: String }],
    points: { type: Number, default: 0 },
    badges: [{
        name: String,
        icon: String,
        message: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    level: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
