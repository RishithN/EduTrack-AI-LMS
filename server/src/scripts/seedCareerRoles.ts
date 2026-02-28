import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CareerRole from '../models/CareerRole';
import LearningResource from '../models/LearningResource';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const roles = [
    // Tech Roles
    {
        roleName: 'Full Stack Developer',
        domain: 'Tech Roles',
        description: 'Builds both client-side and server-side software.',
        shortDescription: 'Build complete web applications.',
        requiredSkills: [
            { skillName: 'JavaScript', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 90, subSkills: [{ name: 'ES6+', topics: ['Promises', 'Async/Await'], estimatedHours: 20 }] },
            { skillName: 'React', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 90, subSkills: [{ name: 'Hooks', topics: ['useEffect', 'useContext'], estimatedHours: 25 }] },
            { skillName: 'Node.js', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 80, subSkills: [{ name: 'Express', topics: ['Middleware', 'Routing'], estimatedHours: 30 }] },
            { skillName: 'Database Design', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 75, subSkills: [{ name: 'SQL/NoSQL', topics: ['Schema Design', 'Normalization'], estimatedHours: 15 }] }
        ],
        academicRequirements: { minimumCGPA: 7.0, preferredSubjects: ['Web Development', 'Data Structures', 'Database Management Systems'], criticalSubjects: ['Data Structures', 'Algorithms'] },
        personalityFit: { creativity: 70, problemSolving: 85, teamwork: 80, technicalAptitude: 90 },
        salaryRanges: [
            { experience: '0-2 years', minSalary: 600000, maxSalary: 1200000, currency: 'INR' },
            { experience: '2-5 years', minSalary: 1200000, maxSalary: 2500000, currency: 'INR' },
            { experience: '5+ years', minSalary: 2500000, maxSalary: 5000000, currency: 'INR' }
        ],
        industryDemandScore: 95,
        futureGrowthScore: 90,
        competitionLevel: 'High',
        roadmapTemplate: [
            { phase: 'The Foundation', duration: 'Month 1-2', skills: ['HTML5', 'CSS3', 'JavaScript'], milestones: ['Build a portfolio site', 'Interactive Todo App'], projects: ['Personal Portfolio'] },
            { phase: 'Frontend Engineering', duration: 'Month 3-4', skills: ['React', 'Redux', 'Tailwind'], milestones: ['Clone a popular app', 'State Management Mastery'], projects: ['E-commerce UI'] },
            { phase: 'Backend Logic', duration: 'Month 5-6', skills: ['Node.js', 'Express', 'API Design'], milestones: ['Build REST APIs', 'Authentication System'], projects: ['Task Manager API'] },
            { phase: 'Database & DevOps', duration: 'Month 7-8', skills: ['MongoDB', 'PostgreSQL', 'Docker'], milestones: ['Database Integration', 'Containerization'], projects: ['Full Stack Blog App'] },
            { phase: 'Capstone Project', duration: 'Month 9+', skills: ['CI/CD', 'Testing', 'System Design'], milestones: ['Deploy to Production', 'Optimized Performance'], projects: ['SaaS Application'] }
        ],
        careerProgression: [{ nextRole: 'Senior Developer', yearsRequired: 3, skillsNeeded: ['System Design', 'Mentorship'] }, { nextRole: 'Tech Lead', yearsRequired: 6, skillsNeeded: ['Architecture', 'Team Management'] }],
        isActive: true
    },
    {
        roleName: 'Data Scientist',
        domain: 'Tech Roles',
        description: 'Analyzes complex data to help organizations make better decisions.',
        shortDescription: 'Turn data into actionable insights.',
        requiredSkills: [
            { skillName: 'Python', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 95, subSkills: [{ name: 'Pandas', topics: ['DataFrames', 'Series'], estimatedHours: 20 }, { name: 'NumPy', topics: ['Arrays', 'Broadcasting'], estimatedHours: 15 }] },
            { skillName: 'SQL', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 90, subSkills: [{ name: 'Joins', topics: ['Inner', 'Outer'], estimatedHours: 10 }, { name: 'Aggregations', topics: ['Group By', 'Having'], estimatedHours: 10 }] },
            { skillName: 'Machine Learning', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 85, subSkills: [{ name: 'Scikit-Learn', topics: ['Regression', 'Classification'], estimatedHours: 40 }] },
            { skillName: 'Data Visualization', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 80, subSkills: [{ name: 'Tableau', topics: ['Dashboards'], estimatedHours: 20 }, { name: 'Matplotlib', topics: ['Plots'], estimatedHours: 15 }] }
        ],
        academicRequirements: { minimumCGPA: 7.5, preferredSubjects: ['Statistics', 'Linear Algebra', 'Database Management'], criticalSubjects: ['Statistics', 'Mathematics'] },
        personalityFit: { analyticalThinking: 95, problemSolving: 90, businessAcumen: 70, communication: 75, researchOrientation: 80 },
        salaryRanges: [
            { experience: '0-2 years', minSalary: 700000, maxSalary: 1400000, currency: 'INR' },
            { experience: '2-5 years', minSalary: 1500000, maxSalary: 3000000, currency: 'INR' },
            { experience: '5+ years', minSalary: 3000000, maxSalary: 6000000, currency: 'INR' }
        ],
        industryDemandScore: 92,
        futureGrowthScore: 95,
        competitionLevel: 'High',
        roadmapTemplate: [
            { phase: 'Mathematics & Stats', duration: 'Month 1-2', skills: ['Statistics', 'Probability', 'Linear Algebra'], milestones: ['Complete Stats Course', 'Statistical Analysis Report'], projects: ['Exploratory Data Analysis'] },
            { phase: 'Python & Data Analysis', duration: 'Month 3-4', skills: ['Python', 'SQL', 'Pandas'], milestones: ['Clean a messy dataset', 'Data Wrangling Mastery'], projects: ['Titanic Dataset Analysis'] },
            { phase: 'Machine Learning Basics', duration: 'Month 5-6', skills: ['Scikit-Learn', 'Regression', 'Classification'], milestones: ['Build a prediction model', 'Model Evaluation'], projects: ['House Price Prediction'] },
            { phase: 'Deep Learning', duration: 'Month 7-8', skills: ['TensorFlow', 'Keras', 'Neural Networks'], milestones: ['Image Classification', 'Basic NLP Model'], projects: ['Digit Recognizer'] },
            { phase: 'MLOps & Deployment', duration: 'Month 9+', skills: ['Model Serving', 'FastAPI', 'Docker'], milestones: ['Deploy Model API', 'Monitoring Dashboard'], projects: ['End-to-End ML Pipeline'] }
        ],
        careerProgression: [{ nextRole: 'Senior Data Scientist', yearsRequired: 3, skillsNeeded: ['Advanced ML', 'Business Strategy'] }, { nextRole: 'Chief Data Officer', yearsRequired: 8, skillsNeeded: ['Executive Leadership', 'Data Governance'] }],
        isActive: true
    },
    {
        roleName: 'AI/ML Engineer',
        domain: 'Tech Roles',
        description: 'Designs and builds artificial intelligence models and systems.',
        shortDescription: 'Build intelligent systems and models.',
        requiredSkills: [
            { skillName: 'Python', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 95, subSkills: [{ name: 'PyTorch', topics: ['Tensors', 'Autograd'], estimatedHours: 30 }] },
            { skillName: 'Mathematics', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 90, subSkills: [{ name: 'Calculus', topics: ['Derivatives', 'Gradients'], estimatedHours: 20 }] },
            { skillName: 'Deep Learning', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 95, subSkills: [{ name: 'Transformers', topics: ['Attention', 'BERT'], estimatedHours: 40 }] },
            { skillName: 'MLOps', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 80, subSkills: [{ name: 'Docker', topics: ['Containers'], estimatedHours: 15 }] }
        ],
        academicRequirements: { minimumCGPA: 8.0, preferredSubjects: ['Artificial Intelligence', 'Mathematics', 'Neural Networks'], criticalSubjects: ['Mathematics', 'Algorithms'] },
        personalityFit: { analyticalThinking: 90, technicalAptitude: 95, researchOrientation: 85, problemSolving: 90 },
        salaryRanges: [
            { experience: '0-2 years', minSalary: 800000, maxSalary: 1600000, currency: 'INR' },
            { experience: '2-5 years', minSalary: 1800000, maxSalary: 3500000, currency: 'INR' },
            { experience: '5+ years', minSalary: 3500000, maxSalary: 8000000, currency: 'INR' }
        ],
        industryDemandScore: 98,
        futureGrowthScore: 99,
        competitionLevel: 'High',
        roadmapTemplate: [
            { phase: 'Python & Math', duration: 'Month 1-2', skills: ['Advanced Python', 'Calculus', 'Linear Algebra'], milestones: ['Implement Math Algorithms', 'Python Optimization'], projects: ['Numpy Implementation from Scratch'] },
            { phase: 'Data Engineering', duration: 'Month 3-4', skills: ['Pandas', 'SQL', 'Feature Engineering'], milestones: ['Build Data Pipelines', 'Data Preprocessing'], projects: ['ETL Pipeline'] },
            { phase: 'Machine Learning', duration: 'Month 5-6', skills: ['Scikit-Learn', 'Ensemble Methods', 'Clustering'], milestones: ['Competitive ML Models', 'Hyperparameter Tuning'], projects: ['Customer Churn Prediction'] },
            { phase: 'Deep Learning', duration: 'Month 7-8', skills: ['PyTorch', 'CNNs', 'RNNs', 'Transformers'], milestones: ['Train Custom Model', 'NLP Application'], projects: ['Image Captioning Bot'] },
            { phase: 'MLOps & GenAI', duration: 'Month 9+', skills: ['Model Deployment', 'LLMs', 'RAG'], milestones: ['Deploy Scalable API', 'Fine-tune LLM'], projects: ['Custom RAG Chatbot'] }
        ],
        careerProgression: [{ nextRole: 'Senior AI Engineer', yearsRequired: 3, skillsNeeded: ['System Architecture', 'Research'] }, { nextRole: 'AI Architect', yearsRequired: 6, skillsNeeded: ['Strategy', 'Large-Scale Systems'] }],
        isActive: true
    },
    {
        roleName: 'Cloud Engineer',
        domain: 'Tech Roles',
        description: 'Designs and manages cloud infrastructure and services.',
        shortDescription: 'Architect scalable cloud solutions.',
        requiredSkills: [
            { skillName: 'AWS/Azure', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 95, subSkills: [{ name: 'EC2/S3', topics: ['Compute', 'Storage'], estimatedHours: 20 }] },
            { skillName: 'Linux', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 85, subSkills: [{ name: 'Bash', topics: ['Scripting', 'Permissions'], estimatedHours: 15 }] },
            { skillName: 'Networking', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 80, subSkills: [{ name: 'TCP/IP', topics: ['DNS', 'HTTP'], estimatedHours: 20 }] },
            { skillName: 'IaC', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 90, subSkills: [{ name: 'Terraform', topics: ['State', 'Modules'], estimatedHours: 25 }] }
        ],
        academicRequirements: { minimumCGPA: 6.5, preferredSubjects: ['Computer Networks', 'Operating Systems', 'Cloud Computing'], criticalSubjects: ['Computer Networks'] },
        personalityFit: { problemSolving: 90, technicalAptitude: 85, analyticalThinking: 80, teamwork: 75 },
        salaryRanges: [
            { experience: '0-2 years', minSalary: 600000, maxSalary: 1200000, currency: 'INR' },
            { experience: '2-5 years', minSalary: 1400000, maxSalary: 2800000, currency: 'INR' },
            { experience: '5+ years', minSalary: 3000000, maxSalary: 6000000, currency: 'INR' }
        ],
        industryDemandScore: 94,
        futureGrowthScore: 92,
        competitionLevel: 'Medium',
        roadmapTemplate: [
            { phase: 'Linux & Networking', duration: 'Month 1-2', skills: ['Linux', 'Bash', 'Networking'], milestones: ['Configure Web Server', 'Network Troubleshooting'], projects: ['Home Lab Setup'] },
            { phase: 'Cloud Basics (AWS)', duration: 'Month 3-4', skills: ['EC2', 'S3', 'IAM', 'VPC'], milestones: ['Deploy Static Site', 'Secure Infrastructure'], projects: ['Highly Available Web App'] },
            { phase: 'Infrastructure as Code', duration: 'Month 5-6', skills: ['Terraform', 'Ansible', 'CloudFormation'], milestones: ['Automate Provisioning', 'Configuration Management'], projects: ['Infrastructure Pipeline'] },
            { phase: 'Containers & Orchestration', duration: 'Month 7-8', skills: ['Docker', 'Kubernetes'], milestones: ['Containerize Apps', 'Deploy K8s Cluster'], projects: ['Microservices Deployment'] },
            { phase: 'CI/CD & Security', duration: 'Month 9+', skills: ['Jenkins', 'GitHub Actions', 'DevSecOps'], milestones: ['Automate Deployments', 'Security Auditing'], projects: ['Complete DevOps Pipeline'] }
        ],
        careerProgression: [{ nextRole: 'Senior Cloud Engineer', yearsRequired: 3, skillsNeeded: ['Advanced Architecture', 'Cost Optimization'] }, { nextRole: 'Cloud Architect', yearsRequired: 6, skillsNeeded: ['Multi-Cloud Strategy', 'Governance'] }],
        isActive: true
    },
    {
        roleName: 'Cyber Security Analyst',
        domain: 'Tech Roles',
        description: 'Protects systems and networks from digital attacks.',
        shortDescription: 'Defend systems against cyber threats.',
        requiredSkills: [
            { skillName: 'Networking', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 95, subSkills: [{ name: 'Packets', topics: ['Wireshark', 'Analysis'], estimatedHours: 25 }] },
            { skillName: 'Operating Systems', category: 'technical', masteryLevel: 'Advanced', importanceWeight: 90, subSkills: [{ name: 'Linux', topics: ['Kernel', 'Permissions'], estimatedHours: 20 }] },
            { skillName: 'Security Tools', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 90, subSkills: [{ name: 'SIEM', topics: ['Splunk', 'Logs'], estimatedHours: 30 }] },
            { skillName: 'Scripting', category: 'technical', masteryLevel: 'Intermediate', importanceWeight: 75, subSkills: [{ name: 'Python', topics: ['Automation'], estimatedHours: 15 }] }
        ],
        academicRequirements: { minimumCGPA: 7.0, preferredSubjects: ['Network Security', 'Cryptography', 'Operating Systems'], criticalSubjects: ['Network Security'] },
        personalityFit: { problemSolving: 95, analyticalThinking: 90, researchOrientation: 80, integrity: 100 },
        salaryRanges: [
            { experience: '0-2 years', minSalary: 500000, maxSalary: 1000000, currency: 'INR' },
            { experience: '2-5 years', minSalary: 1200000, maxSalary: 2500000, currency: 'INR' },
            { experience: '5+ years', minSalary: 2800000, maxSalary: 5500000, currency: 'INR' }
        ],
        industryDemandScore: 96,
        futureGrowthScore: 94,
        competitionLevel: 'Medium',
        roadmapTemplate: [
            { phase: 'Networks & OS', duration: 'Month 1-2', skills: ['TCP/IP', 'Linux', 'Windows Internals'], milestones: ['Network Analysis', 'System Hardening'], projects: ['Secure Lab Setup'] },
            { phase: 'Security Fundamentals', duration: 'Month 3-4', skills: ['Cryptography', 'Access Control', 'Identity Mgmt'], milestones: ['Encrypted comms', 'Policy Implementation'], projects: ['Security Policy Audit'] },
            { phase: 'Ethical Hacking', duration: 'Month 5-6', skills: ['Reconnaissance', 'Metasploit', 'Burp Suite'], milestones: ['Capture The Flag (CTF)', 'Vulnerability Assessment'], projects: ['Penetration Test Report'] },
            { phase: 'Incident Response', duration: 'Month 7-8', skills: ['SIEM', 'Forensics', 'Malware Analysis'], milestones: ['Analyze Logs', 'Malware Dissection'], projects: ['Incident Response Plan'] },
            { phase: 'Advanced Certifications', duration: 'Month 9+', skills: ['OSCP Prep', 'Cloud Security', 'Compliance'], milestones: ['Mock Exam', 'Security Architecture'], projects: ['Enterprise Security Arch'] }
        ],
        careerProgression: [{ nextRole: 'Senior Security Analyst', yearsRequired: 3, skillsNeeded: ['Threat Hunting', 'Advanced Forensics'] }, { nextRole: 'CISO', yearsRequired: 8, skillsNeeded: ['Risk Management', 'Executive Strategy'] }],
        isActive: true
    }
];



// ... (roles array remains the same, assuming it ends at line 165)

const resources = [
    // Full Stack Developer Resources
    {
        title: 'Full Stack Web Development for Beginners',
        description: 'A complete course on HTML, CSS, JavaScript, React, and Node.js.',
        url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        roleName: 'Full Stack Developer', // Helper for seeding
        domain: 'Tech Roles',
        rating: 4.8,
        estimatedDuration: '10 hours',
        topics: ['Web Development', 'Frontend', 'Backend']
    },
    {
        title: 'React JS - React Tutorial for Beginners',
        description: 'Learn React JS from scratch with this crash course.',
        url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['React', 'JavaScript'],
        roleName: 'Full Stack Developer',
        domain: 'Tech Roles',
        rating: 4.9,
        estimatedDuration: '2 hours',
        topics: ['React', 'Components', 'State']
    },
    {
        title: 'Node.js and Express.js - Full Course',
        description: 'Learn how to build a backend API with Node.js and Express.',
        url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Intermediate',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Node.js', 'Express', 'API'],
        roleName: 'Full Stack Developer',
        domain: 'Tech Roles',
        rating: 4.7,
        estimatedDuration: '8 hours',
        topics: ['Backend', 'API', 'Database']
    },

    // Data Scientist Resources
    {
        title: 'Data Science for Beginners',
        description: 'Introduction to Data Science concepts and workflow.',
        url: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Data Science', 'Statistics'],
        roleName: 'Data Scientist',
        domain: 'Tech Roles',
        rating: 4.6,
        estimatedDuration: '2 hours',
        topics: ['Data Science', 'Analytics']
    },
    {
        title: 'Python for Data Science - Course for Beginners',
        description: 'Learn Python libraries like Pandas, NumPy, and Matplotlib.',
        url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Python', 'Pandas', 'NumPy'],
        roleName: 'Data Scientist',
        domain: 'Tech Roles',
        rating: 4.9,
        estimatedDuration: '12 hours',
        topics: ['Python', 'Data Analysis']
    },

    // AI/ML Engineer Resources
    {
        title: 'Machine Learning for Everybody',
        description: 'A non-technical introduction to Machine Learning.',
        url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Machine Learning', 'AI'],
        roleName: 'AI/ML Engineer',
        domain: 'Tech Roles',
        rating: 4.8,
        estimatedDuration: '4 hours',
        topics: ['ML Concepts', 'Algorithms']
    },
    {
        title: 'Deep Learning Crash Course',
        description: 'Understand Neural Networks and Deep Learning basics.',
        url: 'https://www.youtube.com/watch?v=VyWAvY2CF9c',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Intermediate',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Deep Learning', 'Neural Networks'],
        roleName: 'AI/ML Engineer',
        domain: 'Tech Roles',
        rating: 4.7,
        estimatedDuration: '1 hour',
        topics: ['Deep Learning', 'Neural Networks']
    },

    // Cloud Engineer Resources
    {
        title: 'AWS Certified Cloud Practitioner - Full Course',
        description: 'Prepare for the AWS Cloud Practitioner certification.',
        url: 'https://www.youtube.com/watch?v=3hLmDS179YE',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['AWS', 'Cloud Computing'],
        roleName: 'Cloud Engineer',
        domain: 'Tech Roles',
        rating: 4.9,
        estimatedDuration: '13 hours',
        topics: ['AWS', 'Cloud', 'Certification']
    },
    {
        title: 'Docker and Kubernetes Tutorial for Beginners',
        description: 'Learn Containerization and Orchestration.',
        url: 'https://www.youtube.com/watch?v=bhBSlnQcq2k',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Intermediate',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Docker', 'Kubernetes'],
        roleName: 'Cloud Engineer',
        domain: 'Tech Roles',
        rating: 4.8,
        estimatedDuration: '4 hours',
        topics: ['DevOps', 'Containers']
    },

    // Cyber Security Analyst Resources
    {
        title: 'Cyber Security Full Course for Beginners',
        description: 'Learn the basics of Cyber Security, Networking, and more.',
        url: 'https://www.youtube.com/watch?v=nzZkKoREEGo',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Beginner',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Cyber Security', 'Networking'],
        roleName: 'Cyber Security Analyst',
        domain: 'Tech Roles',
        rating: 4.8,
        estimatedDuration: '10 hours',
        topics: ['Security', 'Networking', 'Ethical Hacking']
    },
    {
        title: 'Ethical Hacking Bootcamp',
        description: 'Introduction to Ethical Hacking and Penetration Testing.',
        url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
        type: 'video',
        provider: 'YouTube',
        difficultyLevel: 'Intermediate',
        learningFormat: 'video',
        isPaid: false,
        relatedSkills: ['Ethical Hacking', 'Penetration Testing'],
        roleName: 'Cyber Security Analyst',
        domain: 'Tech Roles',
        rating: 4.7,
        estimatedDuration: '15 hours',
        topics: ['Hacking', 'Pen Test']
    }
];

const seedRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack');
        console.log('MongoDB connected');

        // Clear existing data
        await CareerRole.deleteMany({});
        await LearningResource.deleteMany({});
        console.log('Cleared existing roles and resources');

        // Insert Roles
        const createdRoles = await CareerRole.insertMany(roles);
        console.log('Seeded career roles');

        // Map Roles to Resources
        const roleMap = new Map();
        createdRoles.forEach((role: any) => {
            roleMap.set(role.roleName, role._id);
        });

        const resourcesWithIds = resources.map((res: any) => {
            const relatedRoleId = roleMap.get(res.roleName);
            const { roleName, ...resourceData } = res; // Remove helper field
            return {
                ...resourceData,
                relatedRoles: relatedRoleId ? [relatedRoleId] : []
            };
        });

        // Insert Resources
        await LearningResource.insertMany(resourcesWithIds);
        console.log('Seeded learning resources');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();
