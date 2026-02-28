
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import CareerRole from './src/models/CareerRole';
import LearningResource from './src/models/LearningResource';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack');
        console.log('MongoDB Connected');

        // Clear existing data
        await CareerRole.deleteMany({});
        await LearningResource.deleteMany({});
        console.log('Cleared existing career data');

        // Create Career Role
        const fullStackRole = await CareerRole.create({
            roleName: 'Full Stack Developer',
            domain: 'Tech Roles',
            description: 'Builds both client-side and server-side software.',
            shortDescription: 'Master of frontend and backend technologies.',
            requiredSkills: [
                {
                    skillName: 'JavaScript',
                    category: 'technical',
                    importanceWeight: 90,
                    masteryLevel: 'Advanced',
                    subSkills: [{ name: 'ES6+', topics: ['Arrow functions', 'Promises'], estimatedHours: 20 }]
                },
                {
                    skillName: 'React',
                    category: 'technical',
                    importanceWeight: 85,
                    masteryLevel: 'Intermediate',
                    subSkills: [{ name: 'Hooks', topics: ['useState', 'useEffect'], estimatedHours: 30 }]
                }
            ],
            personalityFit: {
                analyticalThinking: 80,
                creativity: 70,
                teamwork: 75,
                leadership: 60,
                problemSolving: 90,
                communication: 70,
                technicalAptitude: 95,
                businessAcumen: 50,
                researchOrientation: 60,
                designThinking: 65
            },
            academicRequirements: {
                minimumCGPA: 7.0,
                preferredSubjects: ['Data Structures', 'Web Development'],
                criticalSubjects: ['Algorithms']
            },
            roadmapTemplate: [
                {
                    phase: 'Foundation',
                    duration: '2 Months',
                    skills: ['HTML/CSS', 'JavaScript Basics'],
                    milestones: ['Build a personal portfolio', 'Complete JS certification'],
                    projects: ['Portfolio Website']
                },
                {
                    phase: 'Frontend Mastery',
                    duration: '3 Months',
                    skills: ['React', 'Redux', 'Tailwind CSS'],
                    milestones: ['Build an E-commerce UI', 'Master State Management'],
                    projects: ['Shopping Cart App']
                },
                {
                    phase: 'Backend & Database',
                    duration: '3 Months',
                    skills: ['Node.js', 'Express', 'MongoDB'],
                    milestones: ['Create RESTful APIs', 'Database Design'],
                    projects: ['Task Manager API']
                }
            ],
            industryDemandScore: 90,
            futureGrowthScore: 85,
            competitionLevel: 'High',
            salaryRanges: [
                { experience: '0-2 years', minSalary: 500000, maxSalary: 1200000, currency: 'INR' },
                { experience: '2-5 years', minSalary: 1200000, maxSalary: 2500000, currency: 'INR' },
                { experience: '5+ years', minSalary: 2500000, maxSalary: 6000000, currency: 'INR' }
            ],
            careerProgression: [
                { nextRole: 'Senior Full Stack Developer', yearsRequired: 3, skillsNeeded: ['System Design', 'Cloud Architecture'] },
                { nextRole: 'Tech Lead', yearsRequired: 6, skillsNeeded: ['Team Management', 'software Architecture'] }
            ]
        });

        console.log('Created Career Role:', fullStackRole.roleName);

        // Create Learning Resources
        const resources = [
            {
                title: 'Complete Web Development Bootcamp',
                description: 'Become a full-stack web developer with just one course.',
                url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
                type: 'course',
                provider: 'Udemy',
                difficultyLevel: 'Beginner',
                learningFormat: 'video',
                isPaid: true,
                relatedSkills: ['JavaScript', 'React', 'Node.js'],
                relatedRoles: [fullStackRole._id],
                domain: 'Tech Roles',
                rating: 4.8,
                reviewCount: 150000,
                estimatedDuration: '60 hours',
                topics: ['HTML', 'CSS', 'JS', 'React', 'Node'],
                featured: true
            },
            {
                title: 'React Documentation',
                description: 'Official React documentation.',
                url: 'https://react.dev/',
                type: 'documentation',
                provider: 'Meta',
                difficultyLevel: 'Intermediate',
                learningFormat: 'text',
                isPaid: false,
                relatedSkills: ['React'],
                relatedRoles: [fullStackRole._id],
                domain: 'Tech Roles',
                rating: 5.0,
                reviewCount: 0,
                estimatedDuration: 'Ongoing',
                topics: ['React Hooks', 'Components'],
                featured: false
            }
        ];

        await LearningResource.create(resources);
        console.log(`Created ${resources.length} Learning Resources`);

        console.log('Seeding Completed Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
