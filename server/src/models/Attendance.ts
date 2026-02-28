import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    student: mongoose.Types.ObjectId;
    subjectCode: string; // e.g. CS201
    totalClasses: number;
    attendedClasses: number;
    lastUpdated: Date;
}

const AttendanceSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subjectCode: { type: String, required: true },
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Virtual for percentage
AttendanceSchema.virtual('percentage').get(function (this: IAttendance) {
    if (this.totalClasses === 0) return 0;
    return (this.attendedClasses / this.totalClasses) * 100;
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
