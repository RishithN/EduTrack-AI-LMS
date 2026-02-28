/**
 * Domain-Specific Question Banks
 * 
 * Each domain has tailored questions that assess:
 * - Psychometric traits (personality, work style)
 * - Aptitude (problem-solving, technical thinking)
 * - Technical preferences
 * - Behavioral patterns
 */

export interface Question {
    questionId: string;
    questionText: string;
    questionType: 'psychometric' | 'aptitude' | 'technical' | 'behavioral';
    options: string[];
    scoringWeights: {
        analyticalThinking?: number;
        creativity?: number;
        teamwork?: number;
        leadership?: number;
        problemSolving?: number;
        communication?: number;
        technicalAptitude?: number;
        businessAcumen?: number;
        researchOrientation?: number;
        designThinking?: number;
    }[];
}

// TECH ROLES DOMAIN
export const TECH_ROLES_QUESTIONS: Question[] = [
    {
        questionId: 'tech_1',
        questionText: 'Which aspect of software development excites you the most?',
        questionType: 'psychometric',
        options: [
            'Building user interfaces and visual experiences',
            'Designing scalable backend systems and APIs',
            'Training AI models and working with data',
            'Managing cloud infrastructure and deployments'
        ],
        scoringWeights: [
            { creativity: 20, designThinking: 25, technicalAptitude: 15 },
            { analyticalThinking: 25, problemSolving: 20, technicalAptitude: 20 },
            { analyticalThinking: 30, researchOrientation: 25, technicalAptitude: 20 },
            { technicalAptitude: 25, problemSolving: 20, analyticalThinking: 15 }
        ]
    },
    {
        questionId: 'tech_2',
        questionText: 'How do you approach debugging a complex issue?',
        questionType: 'aptitude',
        options: [
            'Check the UI/console for visual clues',
            'Trace through the code logic step by step',
            'Analyze logs and system metrics',
            'Reproduce in isolated environment and test systematically'
        ],
        scoringWeights: [
            { problemSolving: 15, designThinking: 20 },
            { analyticalThinking: 25, problemSolving: 25 },
            { analyticalThinking: 20, technicalAptitude: 20 },
            { problemSolving: 25, analyticalThinking: 20 }
        ]
    },
    {
        questionId: 'tech_3',
        questionText: 'What defines "good code" for you?',
        questionType: 'psychometric',
        options: [
            'Clean, readable, and well-documented',
            'Efficient, optimized, and scalable',
            'Innovative and uses cutting-edge techniques',
            'Reliable, tested, and maintainable'
        ],
        scoringWeights: [
            { communication: 20, teamwork: 15 },
            { analyticalThinking: 25, problemSolving: 20 },
            { creativity: 25, researchOrientation: 20 },
            { problemSolving: 20, technicalAptitude: 20 }
        ]
    },
    {
        questionId: 'tech_4',
        questionText: 'Which technology stack interests you most?',
        questionType: 'technical',
        options: [
            'React/Vue/Angular + Modern CSS',
            'Node.js/Django/Spring Boot + Databases',
            'TensorFlow/PyTorch + Python',
            'Docker/Kubernetes + AWS/Azure'
        ],
        scoringWeights: [
            { designThinking: 25, creativity: 20, technicalAptitude: 15 },
            { technicalAptitude: 25, analyticalThinking: 20 },
            { researchOrientation: 25, analyticalThinking: 25, technicalAptitude: 20 },
            { technicalAptitude: 25, problemSolving: 20 }
        ]
    },
    {
        questionId: 'tech_5',
        questionText: 'How do you prefer to learn new technologies?',
        questionType: 'behavioral',
        options: [
            'Build projects and learn by doing',
            'Read documentation and understand fundamentals',
            'Take courses and follow structured paths',
            'Experiment and explore on my own'
        ],
        scoringWeights: [
            { problemSolving: 20, creativity: 15 },
            { analyticalThinking: 25, researchOrientation: 15 },
            { communication: 15, teamwork: 10 },
            { creativity: 25, researchOrientation: 20 }
        ]
    },
    {
        questionId: 'tech_6',
        questionText: 'What type of projects do you find most engaging?',
        questionType: 'psychometric',
        options: [
            'E-commerce platforms and social media apps',
            'Real-time systems and high-performance applications',
            'Machine learning models and data pipelines',
            'DevOps automation and infrastructure tools'
        ],
        scoringWeights: [
            { designThinking: 20, creativity: 20, technicalAptitude: 15 },
            { analyticalThinking: 25, problemSolving: 25, technicalAptitude: 20 },
            { researchOrientation: 25, analyticalThinking: 25 },
            { technicalAptitude: 25, problemSolving: 20 }
        ]
    },
    {
        questionId: 'tech_7',
        questionText: 'How important is visual design in your work?',
        questionType: 'psychometric',
        options: [
            'Very important - I love creating beautiful UIs',
            'Somewhat important - functionality comes first',
            'Not very important - I prefer backend work',
            'Important for user experience, but not my focus'
        ],
        scoringWeights: [
            { designThinking: 30, creativity: 25 },
            { problemSolving: 15, technicalAptitude: 15 },
            { analyticalThinking: 20, technicalAptitude: 20 },
            { communication: 15, teamwork: 15 }
        ]
    },
    {
        questionId: 'tech_8',
        questionText: 'What security approach do you prefer?',
        questionType: 'technical',
        options: [
            'Use established libraries and frameworks',
            'Implement custom security measures',
            'Focus on data encryption and privacy',
            'Automate security scanning and monitoring'
        ],
        scoringWeights: [
            { technicalAptitude: 15, communication: 10 },
            { analyticalThinking: 25, problemSolving: 20 },
            { analyticalThinking: 20, researchOrientation: 15 },
            { technicalAptitude: 25, problemSolving: 20 }
        ]
    },
    {
        questionId: 'tech_9',
        questionText: 'How do you handle performance optimization?',
        questionType: 'aptitude',
        options: [
            'Optimize rendering and reduce bundle size',
            'Improve algorithms and database queries',
            'Optimize model training and inference',
            'Scale infrastructure and load balancing'
        ],
        scoringWeights: [
            { technicalAptitude: 20, problemSolving: 15 },
            { analyticalThinking: 30, problemSolving: 25 },
            { analyticalThinking: 25, researchOrientation: 20 },
            { technicalAptitude: 25, problemSolving: 20 }
        ]
    },
    {
        questionId: 'tech_10',
        questionText: 'What role do you see yourself in 5 years?',
        questionType: 'psychometric',
        options: [
            'Senior Frontend Developer / UI Architect',
            'Backend Architect / System Designer',
            'AI/ML Engineer / Data Scientist',
            'DevOps Lead / Cloud Architect'
        ],
        scoringWeights: [
            { designThinking: 25, creativity: 20, leadership: 15 },
            { analyticalThinking: 25, problemSolving: 20, leadership: 15 },
            { researchOrientation: 25, analyticalThinking: 25, leadership: 15 },
            { technicalAptitude: 25, problemSolving: 20, leadership: 15 }
        ]
    },
    {
        questionId: 'tech_11',
        questionText: 'How do you view Cloud Infrastructure?',
        questionType: 'technical',
        options: [
            'As a necessary utility for hosting apps',
            'As a programmable platform (Infrastructure as Code)',
            'As a complex system to secure and monitor',
            'As a scalable resource for training models'
        ],
        scoringWeights: [
            { designThinking: 15, problemSolving: 15 },
            { technicalAptitude: 35, problemSolving: 25 },
            { technicalAptitude: 30, analyticalThinking: 25 },
            { researchOrientation: 25, technicalAptitude: 25 }
        ]
    },
    {
        questionId: 'tech_12',
        questionText: 'What is your stance on AI development?',
        questionType: 'psychometric',
        options: [
            'Excited to build smart applications',
            'Interested in the underlying math and algorithms',
            'Concerned about ethics and bias',
            'Focused on deploying models efficiently'
        ],
        scoringWeights: [
            { creativity: 25, technicalAptitude: 20 },
            { researchOrientation: 35, analyticalThinking: 30 },
            { analyticalThinking: 25, communication: 20 },
            { technicalAptitude: 30, problemSolving: 25 }
        ]
    },
    {
        questionId: 'tech_13',
        questionText: 'How do you handle a system security breach?',
        questionType: 'behavioral',
        options: [
            'Patch the vulnerability immediately',
            'Analyze logs to trace the attacker',
            'Communicate with users and stakeholders',
            'Redesign the architecture to prevent recurrence'
        ],
        scoringWeights: [
            { problemSolving: 30, technicalAptitude: 20 },
            { analyticalThinking: 35, technicalAptitude: 25 },
            { communication: 35, leadership: 20 },
            { designThinking: 30, problemSolving: 25 }
        ]
    },
    {
        questionId: 'tech_14',
        questionText: 'Which data challenge interests you?',
        questionType: 'aptitude',
        options: [
            'Visualizing complex datasets',
            'Optimizing database query performance',
            'Cleaning and preprocessing messy data',
            'Designing data warehouses and pipelines'
        ],
        scoringWeights: [
            { designThinking: 30, analyticalThinking: 20 },
            { technicalAptitude: 30, problemSolving: 25 },
            { analyticalThinking: 30, problemSolving: 25 },
            { technicalAptitude: 35, designThinking: 20 }
        ]
    },
    {
        questionId: 'tech_15',
        questionText: 'What is your preferred working environment?',
        questionType: 'psychometric',
        options: [
            'Collaborative team brainstorming sessions',
            'Deep focus time for complex coding',
            'Dynamic environment with constant changes',
            'Structured environment with clear goals'
        ],
        scoringWeights: [
            { teamwork: 35, communication: 30 },
            { analyticalThinking: 30, problemSolving: 25 },
            { creativity: 30, problemSolving: 35 },
            { problemSolving: 30, analyticalThinking: 25 }
        ]
    }
];

// BUSINESS + TECH HYBRID DOMAIN
export const BUSINESS_TECH_QUESTIONS: Question[] = [
    {
        questionId: 'biz_1',
        questionText: 'What aspect of product development interests you most?',
        questionType: 'psychometric',
        options: [
            'Understanding user needs and market trends',
            'Defining product strategy and roadmap',
            'Analyzing metrics and driving growth',
            'Bridging technical and business teams'
        ],
        scoringWeights: [
            { communication: 25, businessAcumen: 25, creativity: 15 },
            { businessAcumen: 30, leadership: 25, analyticalThinking: 20 },
            { analyticalThinking: 30, businessAcumen: 25 },
            { communication: 30, businessAcumen: 20, technicalAptitude: 20 }
        ]
    },
    {
        questionId: 'biz_2',
        questionText: 'How do you approach problem-solving in business contexts?',
        questionType: 'aptitude',
        options: [
            'Gather data and analyze patterns',
            'Talk to stakeholders and understand pain points',
            'Research best practices and industry standards',
            'Prototype solutions and test quickly'
        ],
        scoringWeights: [
            { analyticalThinking: 30, businessAcumen: 20 },
            { communication: 30, teamwork: 25 },
            { researchOrientation: 25, businessAcumen: 20 },
            { problemSolving: 25, creativity: 20 }
        ]
    },
    {
        questionId: 'biz_3',
        questionText: 'What type of analysis do you enjoy most?',
        questionType: 'technical',
        options: [
            'User behavior and conversion funnels',
            'Market research and competitive analysis',
            'Financial modeling and ROI calculations',
            'A/B testing and experiment design'
        ],
        scoringWeights: [
            { analyticalThinking: 25, businessAcumen: 25 },
            { businessAcumen: 30, researchOrientation: 20 },
            { analyticalThinking: 30, businessAcumen: 25 },
            { analyticalThinking: 25, problemSolving: 20 }
        ]
    },
    {
        questionId: 'biz_4',
        questionText: 'How do you prefer to communicate insights?',
        questionType: 'behavioral',
        options: [
            'Visual dashboards and data visualizations',
            'Detailed reports and presentations',
            'Executive summaries with key takeaways',
            'Interactive demos and prototypes'
        ],
        scoringWeights: [
            { communication: 25, analyticalThinking: 20, designThinking: 15 },
            { communication: 30, analyticalThinking: 20 },
            { communication: 30, businessAcumen: 25, leadership: 15 },
            { communication: 25, creativity: 20, technicalAptitude: 15 }
        ]
    },
    {
        questionId: 'biz_5',
        questionText: 'What motivates you in your work?',
        questionType: 'psychometric',
        options: [
            'Solving complex business problems',
            'Driving measurable business impact',
            'Building products users love',
            'Leading teams and initiatives'
        ],
        scoringWeights: [
            { problemSolving: 25, businessAcumen: 25 },
            { businessAcumen: 30, analyticalThinking: 25 },
            { creativity: 25, communication: 20, businessAcumen: 15 },
            { leadership: 30, communication: 25, businessAcumen: 20 }
        ]
    },
    {
        questionId: 'biz_6',
        questionText: 'How technical do you want your role to be?',
        questionType: 'psychometric',
        options: [
            'Highly technical - I want to code regularly',
            'Moderately technical - understand architecture',
            'Lightly technical - focus on business strategy',
            'Technical enough to guide engineering teams'
        ],
        scoringWeights: [
            { technicalAptitude: 30, problemSolving: 20 },
            { technicalAptitude: 20, businessAcumen: 20 },
            { businessAcumen: 30, communication: 25 },
            { technicalAptitude: 20, leadership: 25, communication: 20 }
        ]
    },
    {
        questionId: 'biz_7',
        questionText: 'What skills do you want to develop?',
        questionType: 'behavioral',
        options: [
            'SQL, Python, and data analysis tools',
            'Product management frameworks',
            'Growth hacking and marketing analytics',
            'Stakeholder management and communication'
        ],
        scoringWeights: [
            { analyticalThinking: 25, technicalAptitude: 25 },
            { businessAcumen: 30, leadership: 20 },
            { businessAcumen: 25, analyticalThinking: 25, creativity: 15 },
            { communication: 30, leadership: 25 }
        ]
    },
    {
        questionId: 'biz_8',
        questionText: 'How do you prioritize features or initiatives?',
        questionType: 'aptitude',
        options: [
            'Based on data and user feedback',
            'Based on business value and ROI',
            'Based on technical feasibility',
            'Based on strategic alignment'
        ],
        scoringWeights: [
            { analyticalThinking: 25, communication: 20 },
            { businessAcumen: 30, analyticalThinking: 20 },
            { technicalAptitude: 25, problemSolving: 20 },
            { businessAcumen: 25, leadership: 25 }
        ]
    },
    {
        questionId: 'biz_9',
        questionText: 'What type of company culture appeals to you?',
        questionType: 'psychometric',
        options: [
            'Fast-paced startup with rapid experimentation',
            'Established company with structured processes',
            'Data-driven culture with strong analytics',
            'Consulting environment with diverse projects'
        ],
        scoringWeights: [
            { creativity: 25, problemSolving: 20, businessAcumen: 20 },
            { businessAcumen: 25, communication: 20 },
            { analyticalThinking: 30, businessAcumen: 25 },
            { communication: 30, businessAcumen: 25, leadership: 20 }
        ]
    },
    {
        questionId: 'biz_10',
        questionText: 'What role do you see yourself in 5 years?',
        questionType: 'psychometric',
        options: [
            'Senior Business Analyst / Data Analyst',
            'Product Manager / Product Lead',
            'Growth Manager / Marketing Lead',
            'Technical Consultant / Strategy Advisor'
        ],
        scoringWeights: [
            { analyticalThinking: 30, businessAcumen: 25, leadership: 15 },
            { businessAcumen: 30, leadership: 25, communication: 20 },
            { businessAcumen: 30, analyticalThinking: 25, creativity: 20, leadership: 15 },
            { businessAcumen: 30, communication: 30, technicalAptitude: 20, leadership: 15 }
        ]
    }
];

// CREATIVE TECH DOMAIN
export const CREATIVE_TECH_QUESTIONS: Question[] = [
    {
        questionId: 'creative_1',
        questionText: 'What aspect of design excites you most?',
        questionType: 'psychometric',
        options: [
            'Creating beautiful and intuitive user interfaces',
            'Building immersive gaming experiences',
            'Developing AR/VR applications',
            'Designing interactive animations and effects'
        ],
        scoringWeights: [
            { designThinking: 30, creativity: 30, communication: 15 },
            { creativity: 30, problemSolving: 20, technicalAptitude: 20 },
            { creativity: 30, technicalAptitude: 25, researchOrientation: 20 },
            { creativity: 30, designThinking: 25, technicalAptitude: 15 }
        ]
    },
    {
        questionId: 'creative_2',
        questionText: 'How do you approach user experience design?',
        questionType: 'aptitude',
        options: [
            'Research user needs and create personas',
            'Iterate rapidly with prototypes',
            'Follow design systems and best practices',
            'Innovate with experimental interactions'
        ],
        scoringWeights: [
            { communication: 25, analyticalThinking: 20, designThinking: 25 },
            { creativity: 30, problemSolving: 20 },
            { designThinking: 25, communication: 20 },
            { creativity: 35, researchOrientation: 20 }
        ]
    },
    {
        questionId: 'creative_3',
        questionText: 'What tools do you prefer working with?',
        questionType: 'technical',
        options: [
            'Figma/Adobe XD + HTML/CSS/JS',
            'Unity/Unreal Engine + C#/C++',
            'Unity/A-Frame + WebXR APIs',
            'After Effects + Three.js/WebGL'
        ],
        scoringWeights: [
            { designThinking: 30, creativity: 25, technicalAptitude: 20 },
            { creativity: 30, technicalAptitude: 30, problemSolving: 20 },
            { creativity: 25, technicalAptitude: 30, researchOrientation: 20 },
            { creativity: 30, technicalAptitude: 25, designThinking: 20 }
        ]
    },
    {
        questionId: 'creative_4',
        questionText: 'What type of projects inspire you?',
        questionType: 'psychometric',
        options: [
            'Award-winning app designs',
            'Popular indie games',
            'Cutting-edge VR experiences',
            'Viral interactive websites'
        ],
        scoringWeights: [
            { designThinking: 30, creativity: 30 },
            { creativity: 35, problemSolving: 20 },
            { creativity: 30, researchOrientation: 25, technicalAptitude: 20 },
            { creativity: 35, designThinking: 25 }
        ]
    },
    {
        questionId: 'creative_5',
        questionText: 'How do you balance aesthetics and functionality?',
        questionType: 'aptitude',
        options: [
            'Aesthetics first, then optimize functionality',
            'Functionality first, then enhance visuals',
            'Equal balance between both',
            'Depends on the project requirements'
        ],
        scoringWeights: [
            { creativity: 30, designThinking: 30 },
            { problemSolving: 25, technicalAptitude: 20 },
            { designThinking: 25, problemSolving: 20, creativity: 20 },
            { communication: 20, businessAcumen: 15 }
        ]
    },
    {
        questionId: 'creative_6',
        questionText: 'What motivates your creative work?',
        questionType: 'psychometric',
        options: [
            'Solving user problems elegantly',
            'Pushing technical boundaries',
            'Creating emotional experiences',
            'Building something unique and innovative'
        ],
        scoringWeights: [
            { designThinking: 30, communication: 25, problemSolving: 20 },
            { technicalAptitude: 30, researchOrientation: 25, creativity: 20 },
            { creativity: 35, designThinking: 25 },
            { creativity: 35, researchOrientation: 20 }
        ]
    },
    {
        questionId: 'creative_7',
        questionText: 'How technical do you want your creative role to be?',
        questionType: 'behavioral',
        options: [
            'Focus on design, minimal coding',
            'Balance design and development equally',
            'Heavy coding with creative elements',
            'Pure technical implementation of creative ideas'
        ],
        scoringWeights: [
            { designThinking: 35, creativity: 30 },
            { designThinking: 25, creativity: 25, technicalAptitude: 25 },
            { technicalAptitude: 30, creativity: 25, problemSolving: 20 },
            { technicalAptitude: 35, problemSolving: 25 }
        ]
    },
    {
        questionId: 'creative_8',
        questionText: 'What aspect of game development interests you most?',
        questionType: 'technical',
        options: [
            'Game design and mechanics',
            'Graphics and visual effects',
            'Physics and game engine programming',
            'Storytelling and narrative design'
        ],
        scoringWeights: [
            { creativity: 30, problemSolving: 25, designThinking: 20 },
            { creativity: 35, technicalAptitude: 25, designThinking: 20 },
            { technicalAptitude: 35, analyticalThinking: 30, problemSolving: 25 },
            { creativity: 35, communication: 25 }
        ]
    },
    {
        questionId: 'creative_9',
        questionText: 'How do you stay inspired and creative?',
        questionType: 'behavioral',
        options: [
            'Study design trends and portfolios',
            'Experiment with new tools and techniques',
            'Play games and explore interactive media',
            'Collaborate with other creatives'
        ],
        scoringWeights: [
            { designThinking: 25, researchOrientation: 20 },
            { creativity: 30, researchOrientation: 25 },
            { creativity: 30, researchOrientation: 20 },
            { communication: 30, teamwork: 25, creativity: 20 }
        ]
    },
    {
        questionId: 'creative_10',
        questionText: 'What role do you see yourself in 5 years?',
        questionType: 'psychometric',
        options: [
            'Senior UI/UX Designer / Design Lead',
            'Game Developer / Game Designer',
            'AR/VR Developer / XR Engineer',
            'Creative Technologist / Interactive Developer'
        ],
        scoringWeights: [
            { designThinking: 35, creativity: 30, leadership: 15 },
            { creativity: 35, technicalAptitude: 30, leadership: 15 },
            { creativity: 30, technicalAptitude: 35, researchOrientation: 20, leadership: 15 },
            { creativity: 35, technicalAptitude: 30, leadership: 15 }
        ]
    }
];

// RESEARCH / ADVANCED TECH DOMAIN
export const RESEARCH_TECH_QUESTIONS: Question[] = [
    {
        questionId: 'research_1',
        questionText: 'What aspect of research excites you most?',
        questionType: 'psychometric',
        options: [
            'Developing novel AI algorithms',
            'Building autonomous robotic systems',
            'Creating decentralized blockchain solutions',
            'Advancing quantum computing applications'
        ],
        scoringWeights: [
            { researchOrientation: 35, analyticalThinking: 30, technicalAptitude: 25 },
            { researchOrientation: 30, technicalAptitude: 30, problemSolving: 25 },
            { researchOrientation: 30, analyticalThinking: 25, technicalAptitude: 25 },
            { researchOrientation: 35, analyticalThinking: 35, technicalAptitude: 30 }
        ]
    },
    {
        questionId: 'research_2',
        questionText: 'How do you approach research problems?',
        questionType: 'aptitude',
        options: [
            'Review existing literature and build upon it',
            'Experiment with novel approaches',
            'Collaborate with domain experts',
            'Apply mathematical rigor and formal methods'
        ],
        scoringWeights: [
            { researchOrientation: 30, analyticalThinking: 25 },
            { creativity: 30, researchOrientation: 30, problemSolving: 25 },
            { communication: 30, teamwork: 25, researchOrientation: 20 },
            { analyticalThinking: 35, researchOrientation: 30 }
        ]
    },
    {
        questionId: 'research_3',
        questionText: 'What type of mathematics do you enjoy?',
        questionType: 'technical',
        options: [
            'Linear algebra and calculus (ML/AI)',
            'Geometry and kinematics (Robotics)',
            'Cryptography and number theory (Blockchain)',
            'Quantum mechanics and complex analysis'
        ],
        scoringWeights: [
            { analyticalThinking: 35, researchOrientation: 30, technicalAptitude: 25 },
            { analyticalThinking: 30, problemSolving: 30, technicalAptitude: 25 },
            { analyticalThinking: 35, researchOrientation: 25, technicalAptitude: 25 },
            { analyticalThinking: 40, researchOrientation: 35, technicalAptitude: 30 }
        ]
    },
    {
        questionId: 'research_4',
        questionText: 'What programming paradigm do you prefer?',
        questionType: 'technical',
        options: [
            'Python for rapid prototyping and ML',
            'C++/Rust for systems programming',
            'Solidity/Go for blockchain development',
            'Functional programming for formal verification'
        ],
        scoringWeights: [
            { technicalAptitude: 30, researchOrientation: 25, problemSolving: 20 },
            { technicalAptitude: 35, analyticalThinking: 30, problemSolving: 25 },
            { technicalAptitude: 30, researchOrientation: 25, analyticalThinking: 25 },
            { analyticalThinking: 35, researchOrientation: 30, technicalAptitude: 30 }
        ]
    },
    {
        questionId: 'research_5',
        questionText: 'What motivates your research interests?',
        questionType: 'psychometric',
        options: [
            'Advancing AI to solve real-world problems',
            'Building intelligent physical systems',
            'Revolutionizing trust and transparency',
            'Exploring the frontiers of computation'
        ],
        scoringWeights: [
            { researchOrientation: 35, problemSolving: 30, analyticalThinking: 25 },
            { researchOrientation: 30, technicalAptitude: 30, problemSolving: 30 },
            { researchOrientation: 30, analyticalThinking: 25, creativity: 20 },
            { researchOrientation: 40, analyticalThinking: 35 }
        ]
    },
    {
        questionId: 'research_6',
        questionText: 'How do you validate your research?',
        questionType: 'aptitude',
        options: [
            'Benchmark against state-of-the-art models',
            'Test in real-world scenarios',
            'Peer review and academic publication',
            'Mathematical proofs and formal verification'
        ],
        scoringWeights: [
            { analyticalThinking: 30, researchOrientation: 30 },
            { problemSolving: 30, technicalAptitude: 25 },
            { communication: 30, researchOrientation: 30 },
            { analyticalThinking: 40, researchOrientation: 35 }
        ]
    },
    {
        questionId: 'research_7',
        questionText: 'What research environment appeals to you?',
        questionType: 'behavioral',
        options: [
            'Industry research lab (Google AI, OpenAI)',
            'Academic research (PhD, postdoc)',
            'Startup R&D team',
            'Independent research and open source'
        ],
        scoringWeights: [
            { researchOrientation: 30, teamwork: 25, businessAcumen: 15 },
            { researchOrientation: 40, analyticalThinking: 30 },
            { researchOrientation: 25, creativity: 25, problemSolving: 25 },
            { researchOrientation: 35, creativity: 30 }
        ]
    },
    {
        questionId: 'research_8',
        questionText: 'What scale of impact do you want?',
        questionType: 'psychometric',
        options: [
            'Deploy AI systems used by millions',
            'Build robots that transform industries',
            'Create blockchain protocols for global adoption',
            'Publish groundbreaking theoretical work'
        ],
        scoringWeights: [
            { researchOrientation: 30, businessAcumen: 25, technicalAptitude: 25 },
            { researchOrientation: 30, technicalAptitude: 30, problemSolving: 25 },
            { researchOrientation: 30, analyticalThinking: 25, businessAcumen: 20 },
            { researchOrientation: 40, analyticalThinking: 35 }
        ]
    },
    {
        questionId: 'research_9',
        questionText: 'How do you stay current with research?',
        questionType: 'behavioral',
        options: [
            'Read papers on arXiv and attend conferences',
            'Follow research blogs and podcasts',
            'Implement papers and reproduce results',
            'Participate in research communities'
        ],
        scoringWeights: [
            { researchOrientation: 35, analyticalThinking: 25 },
            { researchOrientation: 25, communication: 20 },
            { researchOrientation: 30, technicalAptitude: 30, problemSolving: 25 },
            { researchOrientation: 30, communication: 30, teamwork: 25 }
        ]
    },
    {
        questionId: 'research_10',
        questionText: 'What role do you see yourself in 5 years?',
        questionType: 'psychometric',
        options: [
            'AI Researcher / ML Scientist',
            'Robotics Engineer / Autonomous Systems Lead',
            'Blockchain Developer / Protocol Engineer',
            'Research Scientist / Academic Professor'
        ],
        scoringWeights: [
            { researchOrientation: 40, analyticalThinking: 35, technicalAptitude: 30, leadership: 15 },
            { researchOrientation: 35, technicalAptitude: 35, problemSolving: 30, leadership: 15 },
            { researchOrientation: 35, analyticalThinking: 30, technicalAptitude: 30, leadership: 15 },
            { researchOrientation: 45, analyticalThinking: 40, communication: 30, leadership: 20 }
        ]
    }
];

/**
 * Get questions for a specific domain
 */
export const getQuestionsForDomain = (domain: string): Question[] => {
    switch (domain) {
        case 'Tech Roles':
            return TECH_ROLES_QUESTIONS;
        case 'Business + Tech Hybrid':
            return BUSINESS_TECH_QUESTIONS;
        case 'Creative Tech':
            return CREATIVE_TECH_QUESTIONS;
        case 'Research / Advanced Tech':
            return RESEARCH_TECH_QUESTIONS;
        default:
            return TECH_ROLES_QUESTIONS;
    }
};
