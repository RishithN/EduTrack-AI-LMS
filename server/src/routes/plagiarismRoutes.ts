import express from 'express';
import { upload, checkPlagiarism } from '../controllers/plagiarismController';

const router = express.Router();

router.post('/check', upload.single('document'), checkPlagiarism);

export default router;
