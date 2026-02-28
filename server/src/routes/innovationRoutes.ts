import express from 'express';
import {
    submitIdea,
    getMyIdeas,
    getAllIdeas,
    updateIdeaStatus,
    getCommunityFeed,
    upvoteIdea,
    addComment
} from '../controllers/innovationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Student routes
router.post('/submit', protect, submitIdea);
router.get('/my-ideas', protect, getMyIdeas);
router.get('/community-feed', protect, getCommunityFeed);
router.put('/:id/upvote', protect, upvoteIdea);
router.post('/:id/comment', protect, addComment);

// Teacher routes (should have teacher check middleware ideally, but protect is enough for now)
router.get('/all', protect, getAllIdeas);
router.put('/:id/status', protect, updateIdeaStatus);

export default router;
