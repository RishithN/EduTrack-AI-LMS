import express from 'express';
import { generateQuiz, saveQuiz, getTeacherQuizzes, getStudentQuizzes, saveQuizResult, getQuizResults } from '../controllers/aiQuizController';
import { protect } from '../middleware/authMiddleware';

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/generate', protect, upload.single('file'), generateQuiz);
router.post('/save', protect, saveQuiz);
router.get('/my-quizzes', protect, getTeacherQuizzes);
router.get('/student-quizzes', protect, getStudentQuizzes);
router.post('/submit', protect, saveQuizResult);
router.get('/results', protect, getQuizResults);

export default router;
