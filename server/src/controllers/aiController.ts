import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const { message, history, context } = req.body;

        const apiKey = process.env.GEMINI_API_KEY || '';

        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey === 'your_google_gemini_api_key') {
            console.log(`Fallback mock triggered for: "${message}" due to missing or placeholder API key.`);

            // Simple mock fallback logic
            const lowerMsg = message.toLowerCase();
            let responseText = "⚠️ **Action Required**: Please open your `server/.env` file and replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API Key. \n\nOnce added, restart the server and I will be fully online to answer anything!";

            if (lowerMsg.includes('react') || lowerMsg.includes('javascript')) {
                responseText = "React is a component-based JS library for building UIs. To unlock full AI answers, please update your Gemini API Key! (Mock Response)";
            } else if (lowerMsg.includes('java') || lowerMsg.includes('oop')) {
                responseText = "Object-Oriented Programming (OOP) in Java relies on Classes, Objects, Inheritance, and Polymorphism. Please update your Gemini API Key for detailed answers. (Mock Response)";
            }

            // Return early with our explanatory message.
            setTimeout(() => {
                res.json({ text: responseText });
            }, 1000);
            return;
        }

        // Initialize Gemini chat Session with the dynamically loaded key
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Universal compatibility for new keys

        // Map frontend {sender: 'user' | 'ai', text: string} to Gemini format:
        // { role: "user" | "model", parts: [{ text: "..." }] }
        const formattedHistory = history ? history.map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        })) : [];

        // Prepend a system-like context to the current query
        const tutorPersona = `You are EduTrack's AI Study Buddy, an expert, encouraging, and highly knowledgeable academic tutor.
Context about the student's current view: ${context || 'General Studies'}.
Keep your answers appropriately concise, formatted in markdown, and tailored to a university student. Ensure you check for clarity.`;

        const fullMessage = `${tutorPersona}\n\nStudent's Query: ${message}`;

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 4096,
                temperature: 0.7,
            },
        });

        console.log(`Sending query to Gemini...`);
        const result = await chat.sendMessage(fullMessage);
        const responseText = result.response.text();

        res.json({ text: responseText });

    } catch (error: any) {
        console.error('AI Chat Error (Gemini API):', error.message || error);
        // By returning 200 OK here, the frontend won't trigger its generic fallback message,
        // and instead displays the actual error reason to the user in the neat chat UI.
        res.status(200).json({
            text: "⚠️ **Google Gemini AI Error:** \n" + (error.message || "An unknown error prevented my brain from connecting.") + "\n\nPlease make sure your API key in `server/.env` is valid and you have internet access."
        });
    }
};
