# Setup Instructions for EduTrack LMS

Follow these steps to get the EduTrack project running on your local machine.

## Prerequisites
- **Node.js**: Ensure you have Node.js (version 18+ recommended) installed.
- **npm**: Node Package Manager (comes with Node.js).
- **MongoDB**: You need a running MongoDB instance (local or Atlas URI).
- **Google Gemini API Key**: Required for the AI Fallback and Quiz Generation features.

## 1. Clone the Repository
If you haven't already, clone the repository to your local machine:
```bash
git clone <your-repository-url>
cd edutrack-monorepo
```

## 2. Install Dependencies
This project uses a monorepo setup. You can install all dependencies from the root directory using the custom npm script:

```bash
npm run install:all
```
*This command will install root dependencies, then navigate and install both `/client` and `/server` dependencies.*

## 3. Environment Variables Configuration
You must configure the environment variables for both the client and the server.

### Server Environment Variables
Create a `.env` file in the `/server` directory:
```bash
cd server
touch .env
```
Add the following keys to your `/server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Client Environment Variables
Create a `.env` file in the `/client` directory (if required based on API proxy setups or VITE flags):
```bash
cd ../client
touch .env
```
Typically, for Vite, your backend URL prefix can be defined as:
```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Run the Development Server
You can start both the React frontend and the Express backend simultaneously from the **root** folder using `concurrently`.

```bash
# From the project root path:
npm run dev
```

The application should now be running:
- **Frontend (Client)**: Typically available at `http://localhost:5173`
- **Backend (Server)**: Typically available at `http://localhost:5000`

## 5. Building for Production
To build the project for a production environment:

```bash
# From the project root path:
npm run build
```
This script will sequentially build the production assets for both the client (Vite) and the server (TypeScript).
