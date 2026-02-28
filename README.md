# EduTrack LMS

EduTrack is a modern Learning Management System (LMS) designed to streamline education for both students and teachers. It features a full-stack architecture with a React-based frontend and a Node.js/Express backend. 

The platform integrates intelligent, custom-built AI features to provide dynamic career guidance and automated study material extraction without relying entirely on external APIs.

## Project Structure

This is a monorepo setup containing both the frontend client and backend server code.

- `/client` - The frontend application (React, Vite, Tailwind CSS)
- `/server` - The backend API (Node.js, Express, MongoDB, Google Generative AI)

## Key Features
- **Student Dashboard**: Timetables, course materials, assignments, profile management, and an AI Study Buddy.
- **Teacher Dashboard**: Analytics, quiz management, assignment grading, and schedule tracking.
- **Career AI Module**: AI-driven career path recommendations based on academic data and psychometric assessments.
- **Innovation Hub**: A centralized community for idea submission, feedback, and collaboration.

## Setup & Installation
For detailed instructions on running the project locally, please refer to the `setup_instructions.md` file.

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Mongoose (MongoDB)
- AI Integration: PDF-Parse (Local NLP extraction), `@google/generative-ai` (Gemini Pro fallback)
