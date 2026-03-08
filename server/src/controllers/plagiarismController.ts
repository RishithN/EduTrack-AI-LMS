import { Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import axios from 'axios';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'));
        }
    }
});

export const checkPlagiarism = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const file = req.file;
        let extractedText = '';

        try {
            // Extract text based on file type
            if (file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(file.buffer);
                extractedText = pdfData.text;
            } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const docxData = await mammoth.extractRawText({ buffer: file.buffer });
                extractedText = docxData.value;
            } else if (file.mimetype === 'text/plain') {
                extractedText = file.buffer.toString('utf-8');
            }
        } catch (extractError: any) {
            console.error('File parsing error:', extractError);
            return res.status(400).json({ error: 'Failed to extract text from the document. The file might be corrupted, password-protected, or an image-only PDF.' });
        }

        if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({ error: 'The document appears to be empty or contains no readable text (e.g., scanned images).' });
        }

        // Call Python AI Microservice
        try {
            const aiResponse = await axios.post('http://127.0.0.1:8000/plagiarism', {
                text: extractedText
            });

            return res.json({
                success: true,
                data: aiResponse.data
            });
        } catch (aiError: any) {
            console.error('Python AI service error:', aiError.message);
            return res.status(502).json({ error: 'AI Plagiarism Service is temporarily down or failed to analyze the text. Please try again.' });
        }

    } catch (error: any) {
        console.error('Unexpected error checking plagiarism:', error);
        res.status(500).json({ error: 'An unexpected internal error occurred during plagiarism check.' });
    }
};
