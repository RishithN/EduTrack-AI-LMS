import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerRoadmap extends Document {
    student: mongoose.Types.ObjectId;
    targetRole: mongoose.Types.ObjectId;
    roleName: string;

    // Student Context
    currentSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    collegeYear: number;
    availableStudyTime: number; // hours per week

    // Roadmap Phases
    phases: {
        phaseName: string;
        phaseNumber: number;
        duration: string; // e.g., "2-3 months"
        startDate?: Date;
        endDate?: Date;
        status: 'not-started' | 'in-progress' | 'completed';

        skills: {
            skillName: string;
            category: 'technical' | 'soft' | 'domain';
            currentLevel: 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
            targetLevel: 'Beginner' | 'Intermediate' | 'Advanced';
            priority: 'High' | 'Medium' | 'Low';

            subSkills: {
                name: string;
                topics: string[];
                estimatedHours: number;
                completed: boolean;
                completedAt?: Date;
            }[];

            progress: number; // 0-100
            completedSubSkills: number;
            totalSubSkills: number;
        }[];

        milestones: {
            name: string;
            description: string;
            completed: boolean;
            completedAt?: Date;
        }[];

        projects: {
            name: string;
            description: string;
            difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
            estimatedHours: number;
            status: 'not-started' | 'in-progress' | 'completed';
            completedAt?: Date;
        }[];

        progress: number; // 0-100
    }[];

    // Overall Progress
    overallProgress: number; // 0-100
    completedPhases: number;
    totalPhases: number;

    // Timeline Estimates
    estimatedCompletionDate: Date;
    estimatedTotalMonths: number;
    adjustedBasedOn: string[]; // Factors that adjusted the timeline

    // Adaptive Adjustments
    adjustmentHistory: {
        adjustedAt: Date;
        reason: string;
        changes: string[];
        previousEstimate: number;
        newEstimate: number;
    }[];

    // Weak Skills Focus
    weakSkills: {
        skillName: string;
        currentLevel: string;
        targetLevel: string;
        improvementPlan: string[];
        priority: number;
    }[];

    status: 'active' | 'completed' | 'paused';
    lastUpdated: Date;
}

const CareerRoadmapSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: Schema.Types.ObjectId, ref: 'CareerRole', required: true },
    roleName: { type: String, required: true },

    currentSkillLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    collegeYear: { type: Number, required: true },
    availableStudyTime: { type: Number, default: 10 },

    phases: [{
        phaseName: String,
        phaseNumber: Number,
        duration: String,
        startDate: Date,
        endDate: Date,
        status: {
            type: String,
            enum: ['not-started', 'in-progress', 'completed'],
            default: 'not-started'
        },

        skills: [{
            skillName: String,
            category: { type: String, enum: ['technical', 'soft', 'domain'] },
            currentLevel: { type: String, enum: ['None', 'Beginner', 'Intermediate', 'Advanced'] },
            targetLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
            priority: { type: String, enum: ['High', 'Medium', 'Low'] },

            subSkills: [{
                name: String,
                topics: [String],
                estimatedHours: Number,
                completed: { type: Boolean, default: false },
                completedAt: Date
            }],

            progress: { type: Number, default: 0, min: 0, max: 100 },
            completedSubSkills: { type: Number, default: 0 },
            totalSubSkills: Number
        }],

        milestones: [{
            name: String,
            description: String,
            completed: { type: Boolean, default: false },
            completedAt: Date
        }],

        projects: [{
            name: String,
            description: String,
            difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
            estimatedHours: Number,
            status: {
                type: String,
                enum: ['not-started', 'in-progress', 'completed'],
                default: 'not-started'
            },
            completedAt: Date
        }],

        progress: { type: Number, default: 0, min: 0, max: 100 }
    }],

    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    completedPhases: { type: Number, default: 0 },
    totalPhases: Number,

    estimatedCompletionDate: Date,
    estimatedTotalMonths: Number,
    adjustedBasedOn: [String],

    adjustmentHistory: [{
        adjustedAt: { type: Date, default: Date.now },
        reason: String,
        changes: [String],
        previousEstimate: Number,
        newEstimate: Number
    }],

    weakSkills: [{
        skillName: String,
        currentLevel: String,
        targetLevel: String,
        improvementPlan: [String],
        priority: Number
    }],

    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active'
    },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<ICareerRoadmap>('CareerRoadmap', CareerRoadmapSchema);
