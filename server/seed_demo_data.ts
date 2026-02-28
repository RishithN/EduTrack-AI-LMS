
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './src/models/User';
import Innovation from './src/models/Innovation';
import Quiz from './src/models/Quiz';

dotenv.config();

const seedDemoData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack');
        console.log('MongoDB Connected');

        // 1. Find or Create Dummy Users (Students & Teacher)

        // Teacher
        let teacher = await User.findOne({ role: 'teacher' });
        if (!teacher) {
            console.log('Creating dummy teacher...');
            teacher = await User.create({
                name: 'Dr. Sarah Wilson',
                email: 'sarah.wilson@example.com',
                passwordHash: 'dummyhash',
                role: 'teacher'
            });
        }

        // Dummy Student 1
        let student1 = await User.findOne({ email: 'alex.chen@example.com' });
        if (!student1) {
            console.log('Creating dummy student 1...');
            student1 = await User.create({
                name: 'Alex Chen',
                email: 'alex.chen@example.com',
                passwordHash: 'dummyhash',
                role: 'student'
            });
        }

        // Dummy Student 2
        let student2 = await User.findOne({ email: 'priya.patel@example.com' });
        if (!student2) {
            console.log('Creating dummy student 2...');
            student2 = await User.create({
                name: 'Priya Patel',
                email: 'priya.patel@example.com',
                passwordHash: 'dummyhash',
                role: 'student'
            });
        }

        // 2. Seed Innovation Hub Ideas
        console.log('Seeding Innovation Ideas...');
        await Innovation.deleteMany({ title: { $in: ['Smart Campus Energy Saver', 'AI Study Buddy Extension'] } }); // Clean up if re-running specific ones

        const ideas = [
            {
                studentId: student1._id,
                studentName: student1.name,
                title: 'Smart Campus Energy Saver',
                description: 'An IoT-based system that automatically adjusts lighting and AC in classrooms based on occupancy. Uses motion sensors and a central dashboard to monitor energy usage.',
                category: 'IoT & Robotics',
                status: 'approved',
                votes: 45,
                comments: [
                    { user: 'Dr. Sarah Wilson', text: 'Great initiative! Have you considered using Zigbee sensors?', date: new Date() }
                ]
            },
            {
                studentId: student2._id,
                studentName: student2.name,
                title: 'AI Study Buddy Extension',
                description: 'A browser extension that summarizes lecture notes and generates flashcards automatically from YouTube educational videos.',
                category: 'Artificial Intelligence',
                status: 'pending',
                votes: 12,
                comments: []
            }
        ];

        await Innovation.create(ideas);
        console.log('Added 2 Sample Innovation Ideas');

        // 3. Seed Sample Quiz
        console.log('Seeding Sample Quiz...');
        await Quiz.deleteMany({ title: 'Web Development Basics' });

        const quiz = {
            title: 'Web Development Basics',
            subjectCode: 'CS101',
            difficulty: 'Easy',
            questions: [
                {
                    questionText: 'Which HTML tag is used to define an internal style sheet?',
                    options: ['<css>', '<script>', '<style>', '<link>'],
                    correctIndex: 2,
                    explanation: 'The <style> tag is used to define style information (CSS) for a document.',
                    marks: 1
                },
                {
                    questionText: 'Which property is used to change the background color?',
                    options: ['color', 'bgcolor', 'background-color', 'background'],
                    correctIndex: 2,
                    explanation: 'The background-color property sets the background color of an element.',
                    marks: 1
                },
                {
                    questionText: 'How do you create a function in JavaScript?',
                    options: ['function:myFunction()', 'function myFunction()', 'function = myFunction()', 'def myFunction()'],
                    correctIndex: 1,
                    explanation: 'In JavaScript, functions are defined with the function keyword, followed by a name, followed by parentheses ().',
                    marks: 2
                },
                {
                    questionText: 'Which event occurs when the user clicks on an HTML element?',
                    options: ['onchange', 'onmouseclick', 'onmouseover', 'onclick'],
                    correctIndex: 3,
                    explanation: 'The onclick event occurs when the user clicks on an element.',
                    marks: 1
                },
                {
                    questionText: 'What does CSS stand for?',
                    options: ['Creative Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
                    correctIndex: 2,
                    explanation: 'CSS stands for Cascading Style Sheets.',
                    marks: 1
                }
            ],
            createdBy: teacher._id
        };

        await Quiz.create(quiz);
        console.log('Added Sample Quiz: Web Development Basics');

        console.log('Demo Data Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding demo data:', error);
        process.exit(1);
    }
};

seedDemoData();
