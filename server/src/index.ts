import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import authRoutes from './routes/authRoutes';
import careerRoutes from './routes/careerRoutes';
import innovationRoutes from './routes/innovationRoutes';
import aiQuizRoutes from './routes/aiQuizRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

// Connect Database
connectDB();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/quiz', aiQuizRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('EduTrack API is running');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
