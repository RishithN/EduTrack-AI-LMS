import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';

// Register User
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, ...profileData } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create User
        user = new User({
            name,
            email,
            passwordHash,
            role,
        });

        await user.save();

        // Create Profile based on Role
        if (role === 'student') {
            const studentProfile = new StudentProfile({
                user: user._id,
                ...profileData, // studentId, department, semester, etc.
                department: 'CSE' // Enforce CSE
            });
            await studentProfile.save();

            user.profileId = studentProfile._id as any;
            await user.save();
        }
        // Add other roles logic here later

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
            }
        );

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check User
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Match Password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Return JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, role: user.role, profileId: user.profileId } });
            }
        );

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
