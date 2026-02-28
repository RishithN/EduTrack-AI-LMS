import { Request, Response } from 'express';
import Innovation from '../models/Innovation';
import User from '../models/User';

// Submit a new idea (Student)
export const submitIdea = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        // Assume req.user is populated by auth middleware
        // @ts-ignore
        const safeUser = req.user;

        if (!safeUser) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const newIdea = new Innovation({
            studentId: safeUser.id,
            studentName: safeUser.name,
            title,
            description,
            status: 'pending'
        });

        await newIdea.save();
        res.status(201).json(newIdea);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting idea', error });
    }
};

// Get ideas for a specific student
export const getMyIdeas = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const ideas = await Innovation.find({ studentId: userId }).sort({ createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ideas', error });
    }
};

// Get all ideas (Teacher)
export const getAllIdeas = async (req: Request, res: Response) => {
    try {
        const ideas = await Innovation.find().sort({ createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all ideas', error });
    }
};

// Update idea status (Teacher)
export const updateIdeaStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;

        const updatedIdea = await Innovation.findByIdAndUpdate(
            id,
            { status, feedback },
            { new: true }
        );

        if (!updatedIdea) {
            res.status(404).json({ message: 'Idea not found' });
            return;
        }

        res.json(updatedIdea);
    } catch (error) {
        res.status(500).json({ message: 'Error updating idea', error });
    }
};

// Get Community Feed (All Ideas - Pending & Approved)
export const getCommunityFeed = async (req: Request, res: Response) => {
    try {
        // Fetch both pending and approved ideas sorted by votes and date
        const ideas = await Innovation.find({ status: { $in: ['approved', 'pending'] } }).sort({ votes: -1, createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community feed', error });
    }
};

// Upvote Idea
export const upvoteIdea = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;

        const idea = await Innovation.findById(id);
        if (!idea) {
            res.status(404).json({ message: 'Idea not found' });
            return;
        }

        // Check if already voted
        if (idea.votedBy?.includes(userId)) {
            res.status(400).json({ message: 'Already voted' });
            return;
        }

        idea.votes = (idea.votes || 0) + 1;
        idea.votedBy = idea.votedBy || [];
        idea.votedBy.push(userId);

        await idea.save();
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting', error });
    }
};

// Add Comment
export const addComment = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userName = req.user.name; // user name from auth middleware
        const { id } = req.params;
        const { text } = req.body;

        const idea = await Innovation.findById(id);
        if (!idea) {
            res.status(404).json({ message: 'Idea not found' });
            return;
        }

        idea.comments = idea.comments || [];
        idea.comments.push({
            user: userName || 'Anonymous',
            text,
            date: new Date()
        });

        await idea.save();
        res.json(idea);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};
