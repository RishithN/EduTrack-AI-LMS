import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerAssessment extends Document {
    student: mongoose.Types.ObjectId;
    domain: 'Tech Roles' | 'Business + Tech Hybrid' | 'Creative Tech' | 'Research / Advanced Tech';

    questions: {
        questionId: string;
        questionText: string;
        questionType: 'psychometric' | 'aptitude' | 'technical' | 'behavioral';
        options: string[];
        selectedOption: string;
        selectedIndex: number;

        // Scoring metadata
        scoringWeights: {
            analyticalThinking?: number;
            creativity?: number;
            teamwork?: number;
            leadership?: number;
            problemSolving?: number;
            communication?: number;
            technicalAptitude?: number;
            businessAcumen?: number;
            researchOrientation?: number;
            designThinking?: number;
        };

        answeredAt: Date;
        timeSpent: number; // seconds
    }[];

    totalQuestions: number;
    completedQuestions: number;
    status: 'in-progress' | 'completed' | 'abandoned';

    startedAt: Date;
    completedAt?: Date;
    totalTimeSpent: number; // minutes

    // Calculated scores
    calculatedScores: {
        analyticalThinking: number;
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
    careerMatches: {
        roleId: string;
        roleName: string;
        fitScore: number;
    }[];
}

const CareerAssessmentSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    domain: {
        type: String,
        enum: ['Tech Roles', 'Business + Tech Hybrid', 'Creative Tech', 'Research / Advanced Tech'],
        required: true
    },

    questions: [{
        questionId: { type: String, required: true },
        questionText: { type: String, required: true },
        questionType: {
            type: String,
            enum: ['psychometric', 'aptitude', 'technical', 'behavioral'],
            required: true
        },
        options: [{ type: String, required: true }],
        selectedOption: String,
        selectedIndex: Number,
        scoringWeights: {
            analyticalThinking: Number,
            creativity: Number,
            teamwork: Number,
            leadership: Number,
            problemSolving: Number,
            communication: Number,
            technicalAptitude: Number,
            businessAcumen: Number,
            researchOrientation: Number,
            designThinking: Number
        },

        answeredAt: Date,
        timeSpent: Number
    }],

    totalQuestions: { type: Number, required: true },
    completedQuestions: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },

    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    totalTimeSpent: { type: Number, default: 0 },

    calculatedScores: {
        analyticalThinking: { type: Number, default: 0 },
        creativity: { type: Number, default: 0 },
        teamwork: { type: Number, default: 0 },
        leadership: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        technicalAptitude: { type: Number, default: 0 },
        businessAcumen: { type: Number, default: 0 },
        researchOrientation: { type: Number, default: 0 },
        designThinking: { type: Number, default: 0 }
    },

    careerMatches: [{
        roleId: String,
        roleName: String,
        fitScore: Number
    }]
}, { timestamps: true });

export default mongoose.model<ICareerAssessment>('CareerAssessment', CareerAssessmentSchema);
