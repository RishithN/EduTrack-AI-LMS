import { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdf = require('pdf-parse');

// --- Helper: Extract Text from File ---
const extractTextFromFile = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
    try {
        if (mimeType === 'application/pdf') {
            const data = await pdf(fileBuffer);
            return cleanText(data.text);
        } else if (mimeType.startsWith('text/')) {
            return cleanText(fileBuffer.toString('utf-8'));
        }
        return "";
    } catch (error) {
        console.error("File extraction error:", error);
        return "";
    }
};

const cleanText = (text: string): string => {
    let cleaned = text.replace(/[^\x20-\x7E\n\t]/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
};


// --- Main Generator Engine using Gemini AI ---
export const generateQuiz = async (req: Request, res: Response) => {
    try {
        const { topic, difficulty, count, questionTypes } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded. Please upload a document to generate a content-grounded quiz." });
        }

        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return res.status(503).json({
                message: "AI Generation is offline. Please configure a valid GEMINI_API_KEY in the server/.env file."
            });
        }

        // A. Extract Text
        const rawText = await extractTextFromFile(file.buffer, file.mimetype);

        if (!rawText || rawText.length < 50) {
            return res.status(422).json({
                message: "Unable to analyze document. Please ensure you upload a valid PDF or Text file containing readable text."
            });
        }

        // B. Generate via Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.2, // Low temperature for factual accuracy based on doc
                responseMimeType: "application/json" // Force JSON output
            }
        });

        // Ensure we handle the questionTypes array correctly (multipart/form-data sends strings sometimes)
        let parsedTypes = ['mcq'];
        try {
            parsedTypes = typeof questionTypes === 'string' ? JSON.parse(questionTypes) : questionTypes;
        } catch (e) { }

        const prompt = `
            You are an expert academic examiner. I will provide you with a source document text.
            Your task is to generate EXACTLY ${count || 5} unique assessment questions based ONLY on the provided text.
            
            Parameters:
            - Difficulty Level: ${difficulty || 'medium'}
            - Topic Context (if any): ${topic || 'General'}
            - Allowed Question Types: ${parsedTypes.join(', ')} (You must mix these types if multiple are provided).
            
            Valid Question Types:
            - 'mcq' : Provide 4 'options', with 'ans' being the index (0-3) of the correct option.
            - 'true_false' : Provide 2 'options' ["True", "False"], with 'ans' being the index (0 or 1).
            - 'descriptive' : Provide an empty array for 'options' [], 'ans' is 0.

            You MUST return a valid JSON object matching exactly this structure:
            {
                "title": "A short generated title for the quiz based on the text",
                "questions": [
                    {
                        "id": 1,
                        "q": "The actual question text",
                        "options": ["Option A", "Option B"], 
                        "ans": 0,
                        "explanation": "A detailed explanation of why this is correct based on the text.",
                        "bloomsLevel": "Remember|Understand|Apply|Analyze|Evaluate|Create",
                        "type": "mcq|true_false|descriptive"
                    }
                ]
            }

            Do NOT wrap the JSON in markdown code blocks. Just return the JSON object directly.
            
            SOURCE TEXT TO ANALYZE:
            '''
            ${rawText.substring(0, 30000)} /* Limiting to avoid massive token costs/limits */
            '''
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // Strip any markdown code blocks returned by Gemini
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        let quizData;
        try {
            quizData = JSON.parse(cleanedText);

            // Re-apply difficulty tagging
            quizData.questions = quizData.questions.map((q: any) => ({
                ...q,
                difficulty: difficulty || 'medium'
            }));

        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", responseText);
            return res.status(500).json({ message: "The AI generated an invalid format. Please try again." });
        }

        res.json({
            title: quizData.title || `Quiz: ${topic || "Document Analysis"}`,
            difficulty: difficulty,
            questions: quizData.questions,
            meta: {
                bloomStats: { remember: "Mixed", understand: "Mixed", apply: "Mixed", analyze: "Mixed" },
                topicsCovered: [topic || "Extracted Concepts"]
            }
        });

    } catch (error: any) {
        console.error('Error generating quiz:', error.message || error);
        res.status(500).json({ message: 'Server error during AI generation', error: error.message || error });
    }
};

export const saveQuiz = async (req: Request, res: Response) => {
    try {
        const { title, subjectCode, questions, difficulty } = req.body;

        // The Quiz model enum expects capitalized values ('Easy', 'Medium', 'Hard')
        // but the frontend sends lowercase ('easy', 'medium', 'hard')
        const normalizedDifficulty = difficulty
            ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
            : 'Medium';

        const newQuiz = new Quiz({
            title,
            subjectCode,
            questions,
            difficulty: normalizedDifficulty,
            createdBy: (req as any).user._id,
        });

        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({ message: 'Failed to save quiz', detail: String(error) });
    }
};

export const getTeacherQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await Quiz.find({ createdBy: (req as any).user._id }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};

export const getStudentQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};

import QuizResult from '../models/QuizResult';

export const saveQuizResult = async (req: Request, res: Response) => {
    try {
        const { quizId, score, total } = req.body;
        const studentId = (req as any).user._id;

        const newResult = new QuizResult({
            quizId,
            studentId,
            score,
            total
        });

        await newResult.save();
        res.status(201).json(newResult);
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ message: 'Failed to save result' });
    }
};

export const getQuizResults = async (req: Request, res: Response) => {
    try {
        // Find quizzes created by this teacher
        const teacherQuizzes = await Quiz.find({ createdBy: (req as any).user._id }).select('_id title subjectCode');
        const quizIds = teacherQuizzes.map(q => q._id);

        // Find all results for these quizzes
        const results = await QuizResult.find({ quizId: { $in: quizIds } })
            .populate('studentId', 'name prn email')
            .populate('quizId', 'title subjectCode')
            .sort({ completedAt: -1 });

        res.json(results);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch results' });
    }
};
