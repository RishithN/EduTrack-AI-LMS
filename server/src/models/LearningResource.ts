import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningResource extends Document {
    title: string;
    description: string;
    url: string;

    // Resource Classification
    type: 'course' | 'video' | 'certification' | 'practice-platform' | 'documentation' | 'tutorial' | 'book' | 'project-idea';
    provider: string; // e.g., "Udemy", "YouTube", "Coursera", "LeetCode"

    // Difficulty & Format
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    learningFormat: 'video' | 'text' | 'interactive' | 'hands-on' | 'mixed';

    // Cost
    isPaid: boolean;
    price?: number;
    currency?: string;

    // Skill Associations
    relatedSkills: string[];
    relatedRoles: mongoose.Types.ObjectId[];
    domain: 'Tech Roles' | 'Business + Tech Hybrid' | 'Creative Tech' | 'Research / Advanced Tech' | 'All';

    // Quality Metrics
    rating: number; // 0-5
    reviewCount: number;
    completionRate?: number; // percentage

    // Time Estimates
    estimatedDuration: string; // e.g., "10 hours", "3 months"
    estimatedHours: number;

    // Content Details
    topics: string[];
    prerequisites: string[];
    learningOutcomes: string[];

    // Metadata
    language: string;
    lastUpdated: Date;
    isActive: boolean;
    featured: boolean;
}

const LearningResourceSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },

    type: {
        type: String,
        enum: ['course', 'video', 'certification', 'practice-platform', 'documentation', 'tutorial', 'book', 'project-idea'],
        required: true
    },
    provider: { type: String, required: true },

    difficultyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    learningFormat: {
        type: String,
        enum: ['video', 'text', 'interactive', 'hands-on', 'mixed'],
        required: true
    },

    isPaid: { type: Boolean, default: false },
    price: Number,
    currency: { type: String, default: 'INR' },

    relatedSkills: [{ type: String }],
    relatedRoles: [{ type: Schema.Types.ObjectId, ref: 'CareerRole' }],
    domain: {
        type: String,
        enum: ['Tech Roles', 'Business + Tech Hybrid', 'Creative Tech', 'Research / Advanced Tech', 'All'],
        default: 'All'
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    completionRate: Number,

    estimatedDuration: String,
    estimatedHours: Number,

    topics: [String],
    prerequisites: [String],
    learningOutcomes: [String],

    language: { type: String, default: 'English' },
    lastUpdated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes for efficient querying
LearningResourceSchema.index({ relatedSkills: 1 });
LearningResourceSchema.index({ relatedRoles: 1 });
LearningResourceSchema.index({ domain: 1, difficultyLevel: 1 });
LearningResourceSchema.index({ isPaid: 1, rating: -1 });

export default mongoose.model<ILearningResource>('LearningResource', LearningResourceSchema);
