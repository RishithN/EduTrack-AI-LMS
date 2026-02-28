import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerProfile extends Document {
    student: mongoose.Types.ObjectId;
    selectedDomain: 'Tech Roles' | 'Business + Tech Hybrid' | 'Creative Tech' | 'Research / Advanced Tech';

    // Student DNA Vector Components
    psychometricScores: {
        analyticalThinking: number;      // 0-100
        creativity: number;               // 0-100
        teamwork: number;                 // 0-100
        leadership: number;               // 0-100
        problemSolving: number;           // 0-100
        communication: number;            // 0-100
        technicalAptitude: number;        // 0-100
        businessAcumen: number;           // 0-100
        researchOrientation: number;      // 0-100
        designThinking: number;           // 0-100
    };

    // Academic Performance Metrics
    academicMetrics: {
        cgpa: number;
        semester: number;
        subjectPerformance: {
            subjectCode: string;
            subjectName: string;
            grade: number;
            performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
        }[];
        overallPerformance: 'Excellent' | 'Good' | 'Average' | 'Poor';
    };

    // LMS Behavior Signals
    lmsBehavior: {
        quizAccuracy: number;             // Average accuracy %
        assignmentCompletionRate: number; // %
        averageAssignmentGrade: number;   // 0-100
        timeSpentLearning: number;        // hours per week
        learningConsistency: number;      // 0-100 score
        retryAttempts: number;            // Average retry attempts
        projectPreferences: string[];     // Types of projects preferred
        courseCompletionRate: number;     // %
        engagementScore: number;          // 0-100
    };

    // Career Match Scores
    careerMatches: {
        roleId: mongoose.Types.ObjectId;
        roleName: string;
        fitScore: number;                 // 0-100
        confidenceScore: number;          // 0-100
        reasoning: string[];              // Explanation points
        strengths: string[];              // Matching strengths
        improvements: string[];           // Areas to improve
        estimatedReadinessMonths: number; // Time to become job-ready
    }[];

    // Top Recommendations
    topRecommendations: {
        primary: mongoose.Types.ObjectId;    // Top career match
        alternatives: mongoose.Types.ObjectId[]; // Alternative paths
    };

    // Assessment History
    assessmentHistory: {
        assessmentId: mongoose.Types.ObjectId;
        completedAt: Date;
        domain: string;
        totalQuestions: number;
        timeSpent: number; // minutes
    }[];

    // Re-evaluation Tracking
    lastEvaluatedAt: Date;
    nextEvaluationDue: Date;
    evaluationCount: number;
    improvementTrends: {
        metric: string;
        previousValue: number;
        currentValue: number;
        change: number;
        evaluatedAt: Date;
    }[];
}

const CareerProfileSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    selectedDomain: {
        type: String,
        enum: ['Tech Roles', 'Business + Tech Hybrid', 'Creative Tech', 'Research / Advanced Tech'],
        required: true
    },

    psychometricScores: {
        analyticalThinking: { type: Number, default: 0, min: 0, max: 100 },
        creativity: { type: Number, default: 0, min: 0, max: 100 },
        teamwork: { type: Number, default: 0, min: 0, max: 100 },
        leadership: { type: Number, default: 0, min: 0, max: 100 },
        problemSolving: { type: Number, default: 0, min: 0, max: 100 },
        communication: { type: Number, default: 0, min: 0, max: 100 },
        technicalAptitude: { type: Number, default: 0, min: 0, max: 100 },
        businessAcumen: { type: Number, default: 0, min: 0, max: 100 },
        researchOrientation: { type: Number, default: 0, min: 0, max: 100 },
        designThinking: { type: Number, default: 0, min: 0, max: 100 }
    },

    academicMetrics: {
        cgpa: { type: Number, required: true },
        semester: { type: Number, required: true },
        subjectPerformance: [{
            subjectCode: String,
            subjectName: String,
            grade: Number,
            performance: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'] }
        }],
        overallPerformance: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'] }
    },

    lmsBehavior: {
        quizAccuracy: { type: Number, default: 0, min: 0, max: 100 },
        assignmentCompletionRate: { type: Number, default: 0, min: 0, max: 100 },
        averageAssignmentGrade: { type: Number, default: 0, min: 0, max: 100 },
        timeSpentLearning: { type: Number, default: 0 },
        learningConsistency: { type: Number, default: 0, min: 0, max: 100 },
        retryAttempts: { type: Number, default: 0 },
        projectPreferences: [{ type: String }],
        courseCompletionRate: { type: Number, default: 0, min: 0, max: 100 },
        engagementScore: { type: Number, default: 0, min: 0, max: 100 }
    },

    careerMatches: [{
        roleId: { type: Schema.Types.ObjectId, ref: 'CareerRole' },
        roleName: String,
        fitScore: { type: Number, min: 0, max: 100 },
        confidenceScore: { type: Number, min: 0, max: 100 },
        reasoning: [String],
        strengths: [String],
        improvements: [String],
        estimatedReadinessMonths: Number
    }],

    topRecommendations: {
        primary: { type: Schema.Types.ObjectId, ref: 'CareerRole' },
        alternatives: [{ type: Schema.Types.ObjectId, ref: 'CareerRole' }]
    },

    assessmentHistory: [{
        assessmentId: { type: Schema.Types.ObjectId, ref: 'CareerAssessment' },
        completedAt: { type: Date, default: Date.now },
        domain: String,
        totalQuestions: Number,
        timeSpent: Number
    }],

    lastEvaluatedAt: { type: Date, default: Date.now },
    nextEvaluationDue: { type: Date },
    evaluationCount: { type: Number, default: 0 },
    improvementTrends: [{
        metric: String,
        previousValue: Number,
        currentValue: Number,
        change: Number,
        evaluatedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model<ICareerProfile>('CareerProfile', CareerProfileSchema);
