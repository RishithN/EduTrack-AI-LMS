import CareerProfile from '../models/CareerProfile';
import CareerRole from '../models/CareerRole';
import CareerAssessment from '../models/CareerAssessment';
import StudentProfile from '../models/StudentProfile';
import Quiz from '../models/Quiz';
import Assignment from '../models/Assignment';

/**
 * Career Scoring Engine - Core Intelligence System
 * 
 * This service calculates career fit scores by combining:
 * 1. Psychometric scores from assessments
 * 2. Academic performance metrics
 * 3. LMS behavior signals
 * 4. Personality fit with role requirements
 */

interface StudentDNAVector {
    psychometricScores: {
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
    academicMetrics: any;
    lmsBehavior: any;
}

/**
 * Calculate Student DNA Vector from all available data sources
 */
export const calculateStudentDNA = async (studentId: string): Promise<StudentDNAVector> => {
    // Fetch student profile
    const studentProfile = await StudentProfile.findOne({ user: studentId });
    if (!studentProfile) {
        throw new Error('Student profile not found');
    }

    // Fetch latest assessment
    const latestAssessment = await CareerAssessment.findOne({
        student: studentId,
        status: 'completed'
    }).sort({ completedAt: -1 });

    // Calculate psychometric scores from assessment
    const psychometricScores = latestAssessment?.calculatedScores || {
        analyticalThinking: 0,
        creativity: 0,
        teamwork: 0,
        leadership: 0,
        problemSolving: 0,
        communication: 0,
        technicalAptitude: 0,
        businessAcumen: 0,
        researchOrientation: 0,
        designThinking: 0
    };

    // Calculate academic metrics
    const academicMetrics = {
        cgpa: studentProfile.cgpa,
        semester: studentProfile.semester,
        subjectPerformance: [],
        overallPerformance: getPerformanceLevel(studentProfile.cgpa)
    };

    // Calculate LMS behavior signals
    const lmsBehavior = await calculateLMSBehavior(studentId);

    return {
        psychometricScores,
        academicMetrics,
        lmsBehavior
    };
};

/**
 * Calculate LMS behavior signals from quiz and assignment data
 */
const calculateLMSBehavior = async (studentId: string) => {
    // Fetch all quizzes and assignments
    const quizzes = await Quiz.find({});
    const assignments = await Assignment.find({});

    // Calculate quiz accuracy
    let totalQuizAttempts = 0;
    let correctAnswers = 0;
    let totalRetries = 0;

    // This is a simplified calculation - in production, you'd track individual quiz submissions
    // For now, we'll use placeholder logic
    const quizAccuracy = 75; // Placeholder

    // Calculate assignment metrics
    let completedAssignments = 0;
    let totalAssignments = assignments.length;
    let totalGrades = 0;
    let gradedAssignments = 0;

    assignments.forEach(assignment => {
        const submission = assignment.submissions.find(
            (sub: any) => sub.studentId.toString() === studentId
        );
        if (submission) {
            completedAssignments++;
            if (submission.grade !== undefined) {
                totalGrades += submission.grade;
                gradedAssignments++;
            }
        }
    });

    const assignmentCompletionRate = totalAssignments > 0
        ? (completedAssignments / totalAssignments) * 100
        : 0;

    const averageAssignmentGrade = gradedAssignments > 0
        ? totalGrades / gradedAssignments
        : 0;

    // Calculate engagement score (composite metric)
    const engagementScore = Math.min(100, (
        (quizAccuracy * 0.3) +
        (assignmentCompletionRate * 0.4) +
        (averageAssignmentGrade * 0.3)
    ));

    return {
        quizAccuracy,
        assignmentCompletionRate,
        averageAssignmentGrade,
        timeSpentLearning: 15, // Placeholder - would track from course materials
        learningConsistency: 70, // Placeholder - would calculate from login patterns
        retryAttempts: totalRetries / Math.max(1, totalQuizAttempts),
        projectPreferences: [], // Placeholder
        courseCompletionRate: 80, // Placeholder
        engagementScore
    };
};

/**
 * Smart Career Scoring Engine
 * Scores all careers within a domain and returns ranked matches
 */
export const scoreCareerMatches = async (
    studentDNA: StudentDNAVector,
    domain: string
): Promise<any[]> => {
    // Fetch all roles in the selected domain
    const roles = await CareerRole.find({ domain, isActive: true });

    const scoredRoles = roles.map(role => {
        // Calculate personality fit score (0-100)
        const personalityFitScore = calculatePersonalityFit(
            studentDNA.psychometricScores,
            role.personalityFit
        );

        // Calculate academic fit score (0-100)
        const academicFitScore = calculateAcademicFit(
            studentDNA.academicMetrics,
            role.academicRequirements
        );

        // Calculate behavioral fit score (0-100)
        const behavioralFitScore = calculateBehavioralFit(
            studentDNA.lmsBehavior,
            role
        );

        // Weighted overall fit score
        const overallFitScore = (
            personalityFitScore * 0.5 +
            academicFitScore * 0.25 +
            behavioralFitScore * 0.25
        );

        // Calculate confidence score based on data completeness
        const confidenceScore = calculateConfidenceScore(studentDNA);

        // Generate reasoning
        const reasoning = generateReasoning(
            studentDNA,
            role,
            personalityFitScore,
            academicFitScore,
            behavioralFitScore
        );

        // Identify strengths and improvements
        const { strengths, improvements } = identifyStrengthsAndGaps(
            studentDNA,
            role
        );

        // Estimate readiness timeline
        const estimatedReadinessMonths = estimateReadinessTimeline(
            overallFitScore,
            studentDNA.academicMetrics.semester
        );

        return {
            roleId: role._id,
            roleName: role.roleName,
            fitScore: Math.round(overallFitScore),
            confidenceScore: Math.round(confidenceScore),
            reasoning,
            strengths,
            improvements,
            estimatedReadinessMonths
        };
    });

    // Sort by fit score descending
    return scoredRoles.sort((a, b) => b.fitScore - a.fitScore);
};

/**
 * Calculate personality fit between student and role
 */
const calculatePersonalityFit = (studentScores: any, roleRequirements: any): number => {
    const traits = [
        'analyticalThinking',
        'creativity',
        'teamwork',
        'leadership',
        'problemSolving',
        'communication',
        'technicalAptitude',
        'businessAcumen',
        'researchOrientation',
        'designThinking'
    ];

    let totalFit = 0;
    let totalWeight = 0;

    traits.forEach(trait => {
        const studentScore = studentScores[trait] || 0;
        const requiredScore = roleRequirements[trait] || 50;

        // Calculate fit (closer to required = higher fit)
        const difference = Math.abs(studentScore - requiredScore);
        const fit = Math.max(0, 100 - difference);

        // Weight by importance (higher required scores = more important)
        const weight = requiredScore / 100;

        totalFit += fit * weight;
        totalWeight += weight;
    });

    return totalWeight > 0 ? totalFit / totalWeight : 50;
};

/**
 * Calculate academic fit
 */
const calculateAcademicFit = (academicMetrics: any, requirements: any): number => {
    const cgpaFit = academicMetrics.cgpa >= requirements.minimumCGPA ? 100 :
        (academicMetrics.cgpa / requirements.minimumCGPA) * 100;

    // Additional logic for subject performance would go here

    return Math.min(100, cgpaFit);
};

/**
 * Calculate behavioral fit based on LMS behavior
 */
const calculateBehavioralFit = (lmsBehavior: any, role: any): number => {
    // High engagement and completion rates indicate good fit
    return (
        lmsBehavior.engagementScore * 0.4 +
        lmsBehavior.assignmentCompletionRate * 0.3 +
        lmsBehavior.quizAccuracy * 0.3
    );
};

/**
 * Calculate confidence score based on data completeness
 */
const calculateConfidenceScore = (studentDNA: StudentDNAVector): number => {
    let score = 100;

    // Reduce confidence if psychometric scores are all zero
    const hasAssessment = Object.values(studentDNA.psychometricScores).some(v => v > 0);
    if (!hasAssessment) score -= 30;

    // Reduce confidence if no LMS data
    if (studentDNA.lmsBehavior.engagementScore === 0) score -= 20;

    return Math.max(50, score);
};

/**
 * Generate human-readable reasoning for recommendations
 */
const generateReasoning = (
    studentDNA: StudentDNAVector,
    role: any,
    personalityFit: number,
    academicFit: number,
    behavioralFit: number
): string[] => {
    const reasoning: string[] = [];

    if (personalityFit > 80) {
        reasoning.push('Your personality traits align exceptionally well with this role');
    } else if (personalityFit > 60) {
        reasoning.push('Your personality shows good compatibility with this role');
    }

    if (academicFit > 80) {
        reasoning.push('Your academic performance exceeds the requirements');
    }

    if (behavioralFit > 70) {
        reasoning.push('Your learning behavior indicates strong potential for this career');
    }

    if (reasoning.length === 0) {
        reasoning.push('This role matches some of your skills and interests');
    }

    return reasoning;
};

/**
 * Identify strengths and areas for improvement
 */
const identifyStrengthsAndGaps = (studentDNA: StudentDNAVector, role: any) => {
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Compare psychometric scores with role requirements
    Object.entries(role.personalityFit).forEach(([trait, required]: [string, any]) => {
        const studentScore = (studentDNA.psychometricScores as any)[trait] || 0;

        if (studentScore >= required) {
            strengths.push(formatTraitName(trait));
        } else if (required - studentScore > 20) {
            improvements.push(formatTraitName(trait));
        }
    });

    return { strengths, improvements };
};

/**
 * Estimate months to become job-ready
 */
const estimateReadinessTimeline = (fitScore: number, currentSemester: number): number => {
    // Higher fit = less time needed
    // Earlier semester = more time available

    const baseLine = 12; // 12 months baseline
    const fitAdjustment = (100 - fitScore) / 10; // 0-10 months based on fit
    const semesterAdjustment = Math.max(0, (8 - currentSemester) * 2); // More time if early semester

    return Math.max(3, Math.round(baseLine + fitAdjustment - semesterAdjustment));
};

/**
 * Get performance level from CGPA
 */
const getPerformanceLevel = (cgpa: number): 'Excellent' | 'Good' | 'Average' | 'Poor' => {
    if (cgpa >= 8.5) return 'Excellent';
    if (cgpa >= 7.0) return 'Good';
    if (cgpa >= 6.0) return 'Average';
    return 'Poor';
};

/**
 * Format trait name for display
 */
const formatTraitName = (trait: string): string => {
    return trait
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
};
