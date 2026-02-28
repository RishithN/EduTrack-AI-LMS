import express from 'express';
import {
    selectDomain,
    getQuestions,
    submitAssessment,
    getCareerProfile,
    getRecommendations,
    generateRoadmap,
    getResources,
    getCareerSimulation,
    getSkillGapAnalysis,
    reEvaluate,
    getAssessmentDetails
} from '../controllers/careerController';

const router = express.Router();

// Domain Selection
router.post('/select-domain', selectDomain);

// Assessment
router.get('/questions/:domain', getQuestions);
router.post('/submit-assessment', submitAssessment);
router.get('/assessment/:assessmentId', getAssessmentDetails);

// Career Profile & Recommendations
router.get('/profile/:studentId', getCareerProfile);
router.get('/recommendations/:studentId', getRecommendations);

// Roadmap
router.post('/roadmap/:studentId/:roleId', generateRoadmap);

// Resources
router.get('/resources/:roleId', getResources);

// Career Simulation
router.get('/simulation/:studentId/:roleId', getCareerSimulation);

// Skill Gap Analysis
router.get('/skill-gap/:studentId/:roleId', getSkillGapAnalysis);

// Re-evaluation
router.post('/re-evaluate/:studentId', reEvaluate);

export default router;
