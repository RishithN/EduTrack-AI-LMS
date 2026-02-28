import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillGapAnalysis extends Document {
    student: mongoose.Types.ObjectId;
    targetRole: mongoose.Types.ObjectId;
    roleName: string;

    // Skill Comparison
    skillGaps: {
        skillName: string;
        category: 'technical' | 'soft' | 'domain';

        currentLevel: 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
        requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced';

        currentScore: number;  // 0-100
        requiredScore: number; // 0-100
        gapScore: number;      // Difference (0-100)

        priority: 'Critical' | 'High' | 'Medium' | 'Low';
        estimatedTimeToClose: number; // hours

        subSkillGaps: {
            name: string;
            hasCurrent: boolean;
            needsImprovement: boolean;
            topics: string[];
        }[];
    }[];

    // Overall Gap Analysis
    overallGapScore: number; // 0-100 (0 = no gap, 100 = large gap)
    criticalGaps: number;
    highPriorityGaps: number;
    totalGaps: number;

    // Improvement Plan
    improvementPlan: {
        phase: number;
        phaseName: string;
        duration: string;

        focusSkills: {
            skillName: string;
            currentLevel: string;
            targetLevel: string;
            actionSteps: string[];
            resources: string[];
            estimatedHours: number;
        }[];

        expectedOutcome: string;
        successMetrics: string[];
    }[];

    // Progress Tracking
    progressTracking: {
        skillName: string;
        initialGap: number;
        currentGap: number;
        improvement: number; // percentage
        lastUpdated: Date;
        trend: 'improving' | 'stable' | 'declining';
    }[];

    // Re-evaluation History
    evaluationHistory: {
        evaluatedAt: Date;
        overallGapScore: number;
        criticalGaps: number;
        improvements: string[];
        newGaps: string[];
    }[];

    lastEvaluatedAt: Date;
    nextEvaluationDue: Date;
    status: 'active' | 'completed' | 'outdated';
}

const SkillGapAnalysisSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: Schema.Types.ObjectId, ref: 'CareerRole', required: true },
    roleName: { type: String, required: true },

    skillGaps: [{
        skillName: { type: String, required: true },
        category: { type: String, enum: ['technical', 'soft', 'domain'], required: true },

        currentLevel: { type: String, enum: ['None', 'Beginner', 'Intermediate', 'Advanced'] },
        requiredLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },

        currentScore: { type: Number, min: 0, max: 100 },
        requiredScore: { type: Number, min: 0, max: 100 },
        gapScore: { type: Number, min: 0, max: 100 },

        priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'] },
        estimatedTimeToClose: Number,

        subSkillGaps: [{
            name: String,
            hasCurrent: Boolean,
            needsImprovement: Boolean,
            topics: [String]
        }]
    }],

    overallGapScore: { type: Number, default: 0, min: 0, max: 100 },
    criticalGaps: { type: Number, default: 0 },
    highPriorityGaps: { type: Number, default: 0 },
    totalGaps: { type: Number, default: 0 },

    improvementPlan: [{
        phase: Number,
        phaseName: String,
        duration: String,

        focusSkills: [{
            skillName: String,
            currentLevel: String,
            targetLevel: String,
            actionSteps: [String],
            resources: [String],
            estimatedHours: Number
        }],

        expectedOutcome: String,
        successMetrics: [String]
    }],

    progressTracking: [{
        skillName: String,
        initialGap: Number,
        currentGap: Number,
        improvement: Number,
        lastUpdated: { type: Date, default: Date.now },
        trend: { type: String, enum: ['improving', 'stable', 'declining'] }
    }],

    evaluationHistory: [{
        evaluatedAt: { type: Date, default: Date.now },
        overallGapScore: Number,
        criticalGaps: Number,
        improvements: [String],
        newGaps: [String]
    }],

    lastEvaluatedAt: { type: Date, default: Date.now },
    nextEvaluationDue: Date,
    status: {
        type: String,
        enum: ['active', 'completed', 'outdated'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model<ISkillGapAnalysis>('SkillGapAnalysis', SkillGapAnalysisSchema);
