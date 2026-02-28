import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'student' | 'teacher' | 'parent' | 'admin';
    profileId?: mongoose.Types.ObjectId; // Reference to specific profile (StudentProfile, etc.)
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'], required: true },
    profileId: { type: Schema.Types.ObjectId, refPath: 'role' }, // Dynamic ref based on role? Or just generic.
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
