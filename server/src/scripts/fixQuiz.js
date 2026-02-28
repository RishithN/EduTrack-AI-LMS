
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define Schema consistent with the app (simplified)
const quizSchema = new mongoose.Schema({
    title: String,
    subjectCode: String,
    difficulty: String,
    questions: Array,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now }
});

// Check if model exists to avoid overwrite error if running multiple times (though likely fresh process)
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

const fixQuiz = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edutrack');
        console.log('Connected to MongoDB');

        const quiz = await Quiz.findOne({ title: 'Web Development Basics' });

        if (quiz) {
            console.log('Found quiz. Updating to 5 questions with 1 mark each...');
            // Keep only the first 5 questions and force marks to 1
            if (quiz.questions.length > 5) {
                quiz.questions = quiz.questions.slice(0, 5);
            }
            // Ensure marks are 1 for all questions
            quiz.questions.forEach(q => q.marks = 1);

            // We need to mark modified because we modified objects inside the array
            quiz.markModified('questions');
            await quiz.save();
            console.log('Quiz updated successfully!');
        } else {
            console.log('Quiz "Web Development Basics" not found. Creating it...');
            const newQuiz = new Quiz({
                title: 'Web Development Basics',
                subjectCode: 'CS205',
                difficulty: 'Easy',
                questions: [
                    { questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language"], correctIndex: 0, explanation: "HTML is standard markup language.", marks: 1 },
                    { questionText: "Which tag is used for links?", options: ["<link>", "<a>", "<href>", "<url>"], correctIndex: 1, explanation: "The anchor tag <a> is used.", marks: 1 },
                    { questionText: "CSS stands for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], correctIndex: 1, explanation: "Cascading Style Sheets.", marks: 1 },
                    { questionText: "Which is a JS Framework?", options: ["Django", "React", "Laravel", "Flask"], correctIndex: 1, explanation: "React is a JS library/framework.", marks: 1 },
                    { questionText: "What is the DOM?", options: ["Document Object Model", "Data Object Mode", "Digital Ordinance Model"], correctIndex: 0, explanation: "Document Object Model.", marks: 1 }
                ]
            });
            await newQuiz.save();
            console.log('Created new "Web Development Basics" quiz with 1 mark each.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixQuiz();
