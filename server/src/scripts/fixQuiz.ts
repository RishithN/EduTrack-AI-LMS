
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const quizSchema = new mongoose.Schema({
    title: String,
    subjectCode: String,
    difficulty: String,
    questions: Array,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);

const fixQuiz = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack');
        console.log('Connected to MongoDB');

        const quiz = await Quiz.findOne({ title: 'Web Development Basics' });

        if (quiz) {
            console.log('Found quiz. Updating to 5 questions...');
            // Keep only the first 5 questions
            if (quiz.questions.length > 5) {
                quiz.questions = quiz.questions.slice(0, 5);
                await quiz.save();
                console.log('Quiz updated successfully!');
            } else {
                console.log('Quiz already has 5 or fewer questions.');
            }
        } else {
            console.log('Quiz "Web Development Basics" not found.');
            // Create it if missing (Scenario where user deleted it or it wasn't seeded properly)
            const newQuiz = new Quiz({
                title: 'Web Development Basics',
                subjectCode: 'CS205',
                difficulty: 'Easy',
                questions: [
                    { questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language"], correctIndex: 0, explanation: "HTML is standard markup language." },
                    { questionText: "Which tag is used for links?", options: ["<link>", "<a>", "<href>", "<url>"], correctIndex: 1, explanation: "The anchor tag <a> is used." },
                    { questionText: "CSS stands for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], correctIndex: 1, explanation: "Cascading Style Sheets." },
                    { questionText: "Which is a JS Framework?", options: ["Django", "React", "Laravel", "Flask"], correctIndex: 1, explanation: "React is a JS library/framework." },
                    { questionText: "What is the DOM?", options: ["Document Object Model", "Data Object Mode", "Digital Ordinance Model"], correctIndex: 0, explanation: "Document Object Model." }
                ],
                // createdBy: dummyId // Optional
            });
            await newQuiz.save();
            console.log('Created new "Web Development Basics" quiz.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixQuiz();
