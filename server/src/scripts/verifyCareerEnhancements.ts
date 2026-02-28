
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import CareerRole from '../models/CareerRole';
import CareerProfile from '../models/CareerProfile';
import axios from 'axios';
import { calculateStudentDNA, scoreCareerMatches } from '../services/careerScoringEngine';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const verifyCareerEnhancements = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected');

        // 1. Verify Seeded Roles
        console.log('\n--- Verifying Career Roles ---');
        const roles = await CareerRole.find({ isActive: true });
        console.log(`Found ${roles.length} active roles.`);
        const expectedRoles = ['Full Stack Developer', 'Data Scientist', 'AI/ML Engineer', 'Cloud Engineer', 'Cyber Security Analyst'];
        // @ts-ignore
        const foundRoleNames = roles.map(r => r.roleName);

        const missingRoles = expectedRoles.filter(role => !foundRoleNames.includes(role));
        if (missingRoles.length > 0) {
            console.error('❌ Missing expected roles:', missingRoles);
        } else {
            console.log('✅ All expected roles found.');
        }

        roles.forEach((role: any) => {
            if (!role.roadmapTemplate || role.roadmapTemplate.length === 0) {
                console.error(`❌ Role ${role.roleName} is missing roadmap template.`);
            } else {
                console.log(`✅ Role ${role.roleName} has ${role.roadmapTemplate.length} roadmap phases.`);
            }
        });

        // 2. Simulate User DNA & Matching
        console.log('\n--- Simulating Assessment & Matching ---');

        // Mock Student DNA for an AI Engineer
        const mockDNA = {
            psychometricScores: {
                analyticalThinking: 92,
                technicalAptitude: 95,
                problemSolving: 90,
                creativity: 70,
                teamwork: 80,
                communication: 75,
                leadership: 60,
                adaptability: 85,
                resilience: 80,
                ethics: 90,
                emotionalIntelligence: 75
            },
            academicMetrics: {
                cgpa: 8.5,
                semester: 6,
                performance: { averageScore: 85, subjects: {} }, // simplified
                participation: 80,
                assignmentCompletion: 90
            },
            lmsBehavior: {
                engagementScore: 85,
                assignmentCompletionRate: 90,
                quizAccuracy: 88,
                learningVelocity: 1.2,
                topicInterests: ['Artificial Intelligence', 'Python', 'Machine Learning']
            }
        };

        const matches = await scoreCareerMatches(mockDNA as any, 'Tech Roles');
        console.log('Top 3 Matches for AI-inclined student:');
        matches.slice(0, 3).forEach((match: any, idx: number) => {
            console.log(`${idx + 1}. ${match.roleName} (Score: ${match.fitScore.toFixed(2)})`);
        });

        const topMatch = matches[0];
        if (topMatch.roleName.includes('AI') || topMatch.roleName.includes('Data')) {
            console.log('✅ Matching logic seems correct (AI/Data role is top match).');
        } else {
            console.warn('⚠️ Matching logic might need tuning. AI/Data role was expected.');
        }

        // 3. Verify Roadmap Generation (Mock)
        // In the real contoller, we just return the template for now or a slightly modified version.
        // Let's just check if we can find the roadmap for the top match.
        const topRole = roles.find((r: any) => r.roleName === topMatch.roleName);
        if (topRole) {
            console.log(`\n--- Roadmap for ${(topRole as any).roleName} ---`);
            console.log(JSON.stringify((topRole as any).roadmapTemplate[0], null, 2)); // improved logging 
            console.log('...');
        }

        // 4. Simulate Assessment Submission and Verify Persistence
        console.log('\n--- Simulating Assessment Submission & Persistence Verification ---');

        // Use a real student ID if possible, or create a mock on the fly if DB allows loose refs
        // For verification, we might need a valid student ID if StudentProfile lookup is strict.
        // But for now let's try with a new ID and see if it fails (it might if StudentProfile doesn't exist).
        // Actually, submitAssessment requires StudentProfile to calculate DNA.
        // So we should create a dummy StudentProfile first or use an existing one.

        // Let's just mock the student creation for this test script
        const StudentProfile = require('../models/StudentProfile').default;
        const User = require('../models/User').default; // Assuming User model exists

        const mockUserId = new mongoose.Types.ObjectId();

        // Create a temporary student profile
        await StudentProfile.create({
            user: mockUserId,
            studentId: "TEST_S001",
            department: "CSE",
            semester: 6,
            section: "A",
            cgpa: 8.5,
            skills: ["Python", "JavaScript"]
        });

        // Fetch questions to answer
        let questions = [];
        try {
            const qRes = await axios.get('http://localhost:5001/api/career/questions/Tech%20Roles');
            questions = qRes.data.questions;
        } catch (e) {
            console.log("Could not fetch questions, using mock answers for length 10");
            questions = new Array(10).fill(0);
        }

        const mockAnswers = questions.map((q: any, idx: number) => ({
            questionId: q.questionId || `q${idx}`,
            selectedOption: "Option A",
            selectedIndex: 0, // Always pick first option for consistency
            timeSpent: 10
        }));

        const payload = {
            studentId: mockUserId.toString(),
            domain: 'Tech Roles',
            answers: mockAnswers,
            timeSpent: 300
        };

        let submissionData: { success: boolean, assessmentId?: string, careerMatches?: any[] } = { success: false };
        try {
            console.log("Submitting assessment...");
            const response = await axios.post('http://localhost:5001/api/career/submit-assessment', payload);
            submissionData = response.data;
        } catch (err: any) {
            console.error('❌ Error submitting assessment:', err.response?.data?.error || err.message);
        }

        if (submissionData.success) {
            console.log(`✅ Assessment submitted. ID: ${submissionData.assessmentId}`);

            if (submissionData.careerMatches && submissionData.careerMatches.length > 0) {
                console.log(`   Response contains ${submissionData.careerMatches.length} matches.`);
            }

            console.log('--- Verifying Persistence ---');

            try {
                const assessmentRes = await axios.get(`http://localhost:5001/api/career/assessment/${submissionData.assessmentId}`);
                const assessment = assessmentRes.data.assessment;

                if (assessment && assessment.careerMatches && assessment.careerMatches.length > 0) {
                    console.log(`✅ Assessment persistence verified. Found ${assessment.careerMatches.length} stored matches.`);
                    console.log(`   Top stored match: ${assessment.careerMatches[0].roleName} (Score: ${assessment.careerMatches[0].fitScore})`);
                } else {
                    console.error('❌ Assessment persistence failed: No careerMatches found in fetched assessment.');
                }
            } catch (err: any) {
                console.error('❌ Error fetching assessment details:', err.message);
            }

            // 5. Verify Resources for Top Match
            if (matches.length > 0) {
                const topRoleId = matches[0].roleId;
                console.log(`\n--- Verifying Resources for Role: ${matches[0].roleName} (${topRoleId}) ---`);
                try {
                    const resourceRes = await axios.get(`http://localhost:5001/api/career/resources/${topRoleId}`);
                    const resources = resourceRes.data.resources;
                    console.log(`✅ Fetched ${resources.length} resources.`);
                    if (resources.length > 0) {
                        console.log(`   Sample Resource: ${resources[0].title} (${resources[0].type})`);
                    } else {
                        console.error('❌ No resources found! Seeding might have failed.');
                    }
                } catch (error: any) {
                    console.error('❌ Error fetching resources:', error.message);
                }
            }

            // Clean up
            await StudentProfile.deleteOne({ user: mockUserId });

        } else {
            console.error('❌ Assessment submission failed.');
        }

        console.log('\nVerification Complete.');

        process.exit(0);

    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    }
};

verifyCareerEnhancements();

