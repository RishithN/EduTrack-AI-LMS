import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerRole extends Document {
    roleName: string;
    domain: 'Tech Roles' | 'Business + Tech Hybrid' | 'Creative Tech' | 'Research / Advanced Tech';
    description: string;
    shortDescription: string;

    // Required Skills with Importance Weights
    requiredSkills: {
        skillName: string;
        category: 'technical' | 'soft' | 'domain';
        importanceWeight: number; // 0-100
        masteryLevel: 'Beginner' | 'Intermediate' | 'Advanced';
        subSkills: {
            name: string;
            topics: string[];
            estimatedHours: number;
        }[];
    }[];

    // Personality Fit Criteria
    personalityFit: {
        analyticalThinking: number;      // 0-100 (required level)
        creativity: number;
        teamwork: number;
        leadership: number;
        problemSolving: number;
        communication: number;
        technicalAptitude: number;
        businessAcumen: number;
        researchOrientation: number;
        designThinking: number;
    };

    // Academic Requirements
    academicRequirements: {
        minimumCGPA: number;
        preferredSubjects: string[];
        criticalSubjects: string[]; // Must perform well in these
    };

    // Roadmap Template
    roadmapTemplate: {
        phase: string;
        duration: string; // e.g., "2-3 months"
        skills: string[];
        milestones: string[];
        projects: string[];
    }[];

    // Market Intelligence
    industryDemandScore: number;    // 0-100
    futureGrowthScore: number;      // 0-100
    competitionLevel: 'Low' | 'Medium' | 'High';

    // Salary Information
    salaryRanges: {
        experience: string; // e.g., "0-2 years", "2-5 years"
        minSalary: number;
        maxSalary: number;
        currency: string;
    }[];

    // Related Roles
    relatedRoles: mongoose.Types.ObjectId[];
    careerProgression: {
        nextRole: string;
        yearsRequired: number;
        skillsNeeded: string[];
    }[];

    isActive: boolean;
}

const CareerRoleSchema: Schema = new Schema({
    roleName: { type: String, required: true, unique: true },
    domain: {
        type: String,
        enum: ['Tech Roles', 'Business + Tech Hybrid', 'Creative Tech', 'Research / Advanced Tech'],
        required: true
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },

    requiredSkills: [{
        skillName: { type: String, required: true },
        category: { type: String, enum: ['technical', 'soft', 'domain'], required: true },
        importanceWeight: { type: Number, min: 0, max: 100, required: true },
        masteryLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
        subSkills: [{
            name: String,
            topics: [String],
            estimatedHours: Number
        }]
    }],

    personalityFit: {
        analyticalThinking: { type: Number, default: 50, min: 0, max: 100 },
        creativity: { type: Number, default: 50, min: 0, max: 100 },
        teamwork: { type: Number, default: 50, min: 0, max: 100 },
        leadership: { type: Number, default: 50, min: 0, max: 100 },
        problemSolving: { type: Number, default: 50, min: 0, max: 100 },
        communication: { type: Number, default: 50, min: 0, max: 100 },
        technicalAptitude: { type: Number, default: 50, min: 0, max: 100 },
        businessAcumen: { type: Number, default: 50, min: 0, max: 100 },
        researchOrientation: { type: Number, default: 50, min: 0, max: 100 },
        designThinking: { type: Number, default: 50, min: 0, max: 100 }
    },

    academicRequirements: {
        minimumCGPA: { type: Number, default: 6.0 },
        preferredSubjects: [String],
        criticalSubjects: [String]
    },

    roadmapTemplate: [{
        phase: String,
        duration: String,
        skills: [String],
        milestones: [String],
        projects: [String]
    }],

    industryDemandScore: { type: Number, default: 50, min: 0, max: 100 },
    futureGrowthScore: { type: Number, default: 50, min: 0, max: 100 },
    competitionLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },

    salaryRanges: [{
        experience: String,
        minSalary: Number,
        maxSalary: Number,
        currency: { type: String, default: 'INR' }
    }],

    relatedRoles: [{ type: Schema.Types.ObjectId, ref: 'CareerRole' }],
    careerProgression: [{
        nextRole: String,
        yearsRequired: Number,
        skillsNeeded: [String]
    }],

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICareerRole>('CareerRole', CareerRoleSchema);
