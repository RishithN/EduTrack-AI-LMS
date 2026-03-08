import { Request, Response } from 'express';
import Mentorship from '../models/Mentorship';
import Message from '../models/Message';

// Get mentor for a student or students for a teacher
export const getMentorships = async (req: Request, res: Response) => {
    try {
        const { userId, role } = req.query; // Assuming auth middleware could inject this too

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        let query = {};
        if (role === 'student') query = { studentId: userId };
        else if (role === 'teacher') query = { teacherId: userId };
        else query = { $or: [{ studentId: userId }, { teacherId: userId }] };

        const mentorships = await Mentorship.find(query)
            .populate('studentId', 'name email')
            .populate('teacherId', 'name email');

        res.json(mentorships);
    } catch (error) {
        console.error('Error fetching mentorships:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a goal
export const addGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Mentorship ID
        const { title, description, deadline } = req.body;

        const mentorship = await Mentorship.findById(id);
        if (!mentorship) {
            return res.status(404).json({ error: 'Mentorship not found' });
        }

        mentorship.goals.push({ title, description, deadline, status: 'pending' });
        await mentorship.save();

        res.json(mentorship);
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Fetch chat messages
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Mentorship ID
        const messages = await Message.find({ mentorshipId: id }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
