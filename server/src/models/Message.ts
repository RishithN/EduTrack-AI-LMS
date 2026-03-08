import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    mentorshipId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId; // User ID
    text: string;
    read: boolean;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    mentorshipId: { type: Schema.Types.ObjectId, ref: 'Mentorship', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
