import { Request, Response } from 'express';
import CareerProfile from '../models/CareerProfile';
import CareerAssessment from '../models/CareerAssessment';
import CareerRole from '../models/CareerRole';
import CareerRoadmap from '../models/CareerRoadmap';
import SkillGapAnalysis from '../models/SkillGapAnalysis';
import LearningResource from '../models/LearningResource';
import { calculateStudentDNA, scoreCareerMatches } from '../services/careerScoringEngine';
import { getQuestionsForDomain } from '../data/questionBanks';

/**
 * Select primary career domain
 */
export const selectDomain = async (req: Request, res: Response) => {
    try {
        const { studentId, domain } = req.body;

        if (!studentId || !domain) {
            return res.status(400).json({ error: 'Student ID and domain are required' });
        }

        // Check if profile exists, create or update
        let careerProfile = await CareerProfile.findOne({ student: studentId });

        if (careerProfile) {
            careerProfile.selectedDomain = domain;
            await careerProfile.save();
        } else {
            careerProfile = new CareerProfile({
                student: studentId,
                selectedDomain: domain,
                academicMetrics: {
                    cgpa: 0,
                    semester: 1,
                    subjectPerformance: [],
                    overallPerformance: 'Average'
                }
            });
            await careerProfile.save();
        }

        res.json({ success: true, domain, profileId: careerProfile._id });
    } catch (error: any) {
        console.error('Error selecting domain:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get domain-specific questions
 */
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const { domain } = req.params;

        const questions = getQuestionsForDomain(domain);

        // Remove scoring weights from response (keep them server-side)
        const clientQuestions = questions.map(q => ({
            questionId: q.questionId,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options
        }));

        res.json({ questions: clientQuestions });
    } catch (error: any) {
        console.error('Error getting questions:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Submit assessment and calculate results
 */
export const submitAssessment = async (req: Request, res: Response) => {
    try {
        const { studentId, domain, answers, timeSpent } = req.body;

        if (!studentId || !domain || !answers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get full questions with scoring weights
        const questions = getQuestionsForDomain(domain);

        // Calculate psychometric scores
        const calculatedScores = {
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

        const scoreCounts = { ...calculatedScores };

        answers.forEach((answer: any, index: number) => {
            const question = questions[index];
            if (!question) return;

            const selectedIndex = answer.selectedIndex;
            const weights = question.scoringWeights[selectedIndex];

            if (weights) {
                Object.entries(weights).forEach(([trait, score]) => {
                    if (score) {
                        (calculatedScores as any)[trait] += score;
                        (scoreCounts as any)[trait] += 1;
                    }
                });
            }
        });

        // Normalize scores to 0-100
        Object.keys(calculatedScores).forEach(trait => {
            const count = (scoreCounts as any)[trait];
            if (count > 0) {
                (calculatedScores as any)[trait] = Math.min(100,
                    ((calculatedScores as any)[trait] / count) * 2.5
                );
            }
        });

        // Calculate Student DNA Vector
        const studentDNA = await calculateStudentDNA(studentId);

        // Score career matches
        const careerMatches = await scoreCareerMatches(studentDNA, domain);

        // Create assessment record
        const assessment = new CareerAssessment({
            student: studentId,
            domain,
            questions: answers.map((answer: any, index: number) => ({
                ...questions[index],
                selectedOption: answer.selectedOption,
                selectedIndex: answer.selectedIndex,
                answeredAt: new Date(),
                timeSpent: answer.timeSpent || 0
            })),
            totalQuestions: questions.length,
            completedQuestions: answers.length,
            status: 'completed',
            completedAt: new Date(),
            totalTimeSpent: timeSpent || 0,
            calculatedScores,
            careerMatches: careerMatches.map(m => ({
                roleId: m.roleId,
                roleName: m.roleName,
                fitScore: m.fitScore
            }))
        });

        await assessment.save();

        // Update career profile with psychometric scores
        let careerProfile = await CareerProfile.findOne({ student: studentId });
        if (careerProfile) {
            careerProfile.psychometricScores = calculatedScores;
            careerProfile.assessmentHistory.push({
                assessmentId: assessment._id as any,
                completedAt: new Date(),
                domain,
                totalQuestions: questions.length,
                timeSpent: timeSpent || 0
            });
            await careerProfile.save();
        }



        // Update career profile with matches
        if (careerProfile) {
            careerProfile.careerMatches = careerMatches;
            if (careerMatches.length > 0) {
                careerProfile.topRecommendations = {
                    primary: careerMatches[0].roleId,
                    alternatives: careerMatches.slice(1, 4).map(m => m.roleId)
                };
            }
            careerProfile.lastEvaluatedAt = new Date();
            careerProfile.evaluationCount += 1;
            await careerProfile.save();
        }

        res.json({
            success: true,
            assessmentId: assessment._id,
            psychometricScores: calculatedScores,
            careerMatches: careerMatches.slice(0, 5) // Top 5 matches
        });
    } catch (error: any) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get student career profile
 */
export const getCareerProfile = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const profile = await CareerProfile.findOne({ student: studentId })
            .populate('topRecommendations.primary')
            .populate('topRecommendations.alternatives');

        if (!profile) {
            return res.status(404).json({ error: 'Career profile not found' });
        }

        res.json({ profile });
    } catch (error: any) {
        console.error('Error getting career profile:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get career recommendations
 */
export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const profile = await CareerProfile.findOne({ student: studentId });

        if (!profile) {
            return res.status(404).json({ error: 'Career profile not found' });
        }

        // Get detailed role information for matches
        const detailedMatches = await Promise.all(
            profile.careerMatches.slice(0, 5).map(async (match) => {
                const role = await CareerRole.findById(match.roleId);
                return {
                    ...(match as any).toObject(),
                    roleDetails: role
                };
            })
        );

        res.json({ recommendations: detailedMatches });
    } catch (error: any) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Generate personalized roadmap
 */
export const generateRoadmap = async (req: Request, res: Response) => {
    try {
        const { studentId, roleId } = req.params;
        const { currentSkillLevel, availableStudyTime } = req.body;

        const role = await CareerRole.findById(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Career role not found' });
        }

        const profile = await CareerProfile.findOne({ student: studentId });
        if (!profile) {
            return res.status(404).json({ error: 'Career profile not found' });
        }

        // Check if roadmap already exists
        let roadmap = await CareerRoadmap.findOne({ student: studentId, targetRole: roleId });

        if (!roadmap) {
            // Generate new roadmap from template
            const phases = role.roadmapTemplate.map((template, index) => ({
                phaseName: template.phase,
                phaseNumber: index + 1,
                duration: template.duration,
                status: index === 0 ? 'in-progress' : 'not-started',
                skills: template.skills.map(skillName => {
                    const roleSkill = role.requiredSkills.find(s => s.skillName === skillName);
                    return {
                        skillName,
                        category: roleSkill?.category || 'technical',
                        currentLevel: 'None',
                        targetLevel: roleSkill?.masteryLevel || 'Intermediate',
                        priority: roleSkill?.importanceWeight && roleSkill.importanceWeight > 70 ? 'High' : 'Medium',
                        subSkills: roleSkill?.subSkills || [],
                        progress: 0,
                        completedSubSkills: 0,
                        totalSubSkills: roleSkill?.subSkills.length || 0
                    };
                }),
                milestones: template.milestones.map(m => ({
                    name: m,
                    description: '',
                    completed: false
                })),
                projects: template.projects.map(p => ({
                    name: p,
                    description: '',
                    difficulty: 'Intermediate',
                    estimatedHours: 40,
                    status: 'not-started'
                })),
                progress: 0
            }));

            roadmap = new CareerRoadmap({
                student: studentId,
                targetRole: roleId,
                roleName: role.roleName,
                currentSkillLevel: currentSkillLevel || 'Beginner',
                collegeYear: profile.academicMetrics.semester,
                availableStudyTime: availableStudyTime || 10,
                phases,
                overallProgress: 0,
                completedPhases: 0,
                totalPhases: phases.length,
                estimatedTotalMonths: phases.length * 2,
                estimatedCompletionDate: new Date(Date.now() + phases.length * 2 * 30 * 24 * 60 * 60 * 1000),
                adjustedBasedOn: ['Current skill level', 'Available study time'],
                status: 'active'
            });

            await roadmap.save();
        }

        res.json({ roadmap });
    } catch (error: any) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get curated resources for a role
 */
export const getResources = async (req: Request, res: Response) => {
    try {
        const { roleId } = req.params;
        const { difficultyLevel, learningFormat, isPaid } = req.query;

        const role = await CareerRole.findById(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Career role not found' });
        }

        // Build query
        const query: any = {
            relatedRoles: roleId,
            isActive: true
        };

        if (difficultyLevel) query.difficultyLevel = difficultyLevel;
        if (learningFormat) query.learningFormat = learningFormat;
        if (isPaid !== undefined) query.isPaid = isPaid === 'true';

        const resources = await LearningResource.find(query)
            .sort({ featured: -1, rating: -1 })
            .limit(20);

        res.json({ resources });
    } catch (error: any) {
        console.error('Error getting resources:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get career simulation/projection
 */
export const getCareerSimulation = async (req: Request, res: Response) => {
    try {
        const { studentId, roleId } = req.params;

        const role = await CareerRole.findById(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Career role not found' });
        }

        const roadmap = await CareerRoadmap.findOne({ student: studentId, targetRole: roleId });

        // Generate simulation data
        const simulation = {
            oneYear: {
                skillsGained: roadmap ? roadmap.phases.slice(0, 2).flatMap(p => p.skills.map(s => s.skillName)) : [],
                projectsCompleted: roadmap ? roadmap.phases.slice(0, 2).flatMap(p => p.projects.map(pr => pr.name)) : [],
                jobRole: `Junior ${role.roleName}`,
                salaryRange: role.salaryRanges.find(s => s.experience === '0-2 years') || null
            },
            threeYears: {
                skillsGained: roadmap ? roadmap.phases.flatMap(p => p.skills.map(s => s.skillName)) : [],
                projectsCompleted: roadmap ? roadmap.phases.flatMap(p => p.projects.map(pr => pr.name)) : [],
                jobRole: role.roleName,
                salaryRange: role.salaryRanges.find(s => s.experience === '2-5 years') || null,
                roleTransition: role.careerProgression.length > 0 ? role.careerProgression[0].nextRole : null
            },
            fiveYears: {
                skillsGained: roadmap ? [...roadmap.phases.flatMap(p => p.skills.map(s => s.skillName)), 'Leadership', 'Mentoring'] : [],
                projectsCompleted: roadmap ? [...roadmap.phases.flatMap(p => p.projects.map(pr => pr.name)), 'Led team projects'] : [],
                jobRole: role.careerProgression.length > 0 ? role.careerProgression[0].nextRole : `Senior ${role.roleName}`,
                salaryRange: role.salaryRanges.find(s => s.experience === '5+ years') || null,
                roleTransition: role.careerProgression.length > 1 ? role.careerProgression[1].nextRole : null
            }
        };

        res.json({ simulation });
    } catch (error: any) {
        console.error('Error getting career simulation:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get skill gap analysis
 */
export const getSkillGapAnalysis = async (req: Request, res: Response) => {
    try {
        const { studentId, roleId } = req.params;

        const role = await CareerRole.findById(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Career role not found' });
        }

        const profile = await CareerProfile.findOne({ student: studentId });
        if (!profile) {
            return res.status(404).json({ error: 'Career profile not found' });
        }

        // Check if analysis exists
        let analysis = await SkillGapAnalysis.findOne({ student: studentId, targetRole: roleId });

        if (!analysis) {
            // Generate new analysis
            const skillGaps = role.requiredSkills.map(skill => {
                const currentScore = 0; // Would calculate from student's actual skills
                const requiredScore = skill.importanceWeight;
                const gapScore = Math.max(0, requiredScore - currentScore);

                let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
                if (gapScore > 70) priority = 'Critical';
                else if (gapScore > 50) priority = 'High';
                else if (gapScore > 30) priority = 'Medium';
                else priority = 'Low';

                return {
                    skillName: skill.skillName,
                    category: skill.category,
                    currentLevel: 'None',
                    requiredLevel: skill.masteryLevel,
                    currentScore,
                    requiredScore,
                    gapScore,
                    priority,
                    estimatedTimeToClose: Math.ceil(gapScore / 10) * 10, // hours
                    subSkillGaps: skill.subSkills.map(sub => ({
                        name: sub.name,
                        hasCurrent: false,
                        needsImprovement: true,
                        topics: sub.topics
                    }))
                };
            });

            const criticalGaps = skillGaps.filter(g => g.priority === 'Critical').length;
            const highPriorityGaps = skillGaps.filter(g => g.priority === 'High').length;
            const overallGapScore = skillGaps.reduce((sum, g) => sum + g.gapScore, 0) / skillGaps.length;

            analysis = new SkillGapAnalysis({
                student: studentId,
                targetRole: roleId,
                roleName: role.roleName,
                skillGaps,
                overallGapScore,
                criticalGaps,
                highPriorityGaps,
                totalGaps: skillGaps.length,
                improvementPlan: [],
                progressTracking: [],
                status: 'active'
            });

            await analysis.save();
        }

        res.json({ analysis });
    } catch (error: any) {
        console.error('Error getting skill gap analysis:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Re-evaluate student career profile
 */
export const reEvaluate = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const profile = await CareerProfile.findOne({ student: studentId });
        if (!profile) {
            return res.status(404).json({ error: 'Career profile not found' });
        }

        // Recalculate Student DNA
        const studentDNA = await calculateStudentDNA(studentId);

        // Re-score career matches
        const careerMatches = await scoreCareerMatches(studentDNA, profile.selectedDomain);

        // Track improvements
        const previousMatches = profile.careerMatches;
        const improvementTrends = careerMatches.map((newMatch, index) => {
            const oldMatch = previousMatches.find(m => m.roleId.toString() === newMatch.roleId.toString());
            if (oldMatch) {
                return {
                    metric: newMatch.roleName,
                    previousValue: oldMatch.fitScore,
                    currentValue: newMatch.fitScore,
                    change: newMatch.fitScore - oldMatch.fitScore,
                    evaluatedAt: new Date()
                };
            }
            return null;
        }).filter(Boolean);

        // Update profile
        profile.careerMatches = careerMatches;
        profile.lmsBehavior = studentDNA.lmsBehavior;
        profile.academicMetrics = studentDNA.academicMetrics;
        profile.lastEvaluatedAt = new Date();
        profile.evaluationCount += 1;
        profile.improvementTrends.push(...improvementTrends as any);

        await profile.save();

        res.json({
            success: true,
            careerMatches: careerMatches.slice(0, 5),
            improvementTrends
        });
    } catch (error: any) {
        console.error('Error re-evaluating profile:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get specific assessment details
 */
export const getAssessmentDetails = async (req: Request, res: Response) => {
    try {
        const { assessmentId } = req.params;

        const assessment = await CareerAssessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        res.json({ assessment });
    } catch (error: any) {
        console.error('Error getting assessment details:', error);
        res.status(500).json({ error: error.message });
    }
};
