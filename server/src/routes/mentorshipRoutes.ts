import express from 'express';
import { getMentorships, addGoal, getMessages } from '../controllers/mentorshipController';

const router = express.Router();

router.get('/', getMentorships);
router.post('/:id/goals', addGoal);
router.get('/:id/messages', getMessages);

export default router;
