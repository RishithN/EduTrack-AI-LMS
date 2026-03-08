import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import authRoutes from './routes/authRoutes';
import careerRoutes from './routes/careerRoutes';
import innovationRoutes from './routes/innovationRoutes';
import aiQuizRoutes from './routes/aiQuizRoutes';
import aiRoutes from './routes/aiRoutes';
import mentorshipRoutes from './routes/mentorshipRoutes';
import plagiarismRoutes from './routes/plagiarismRoutes';
import Message from './models/Message';

dotenv.config();

// Connect Database
connectDB();

const app: Express = express();
const port = process.env.PORT || 5001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);

    socket.on('join_mentorship', (mentorshipId) => {
        socket.join(mentorshipId);
        console.log(`User joined mentorship room: ${mentorshipId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            const { mentorshipId, senderId, text } = data;

            // Save message to database
            const newMessage = new Message({ mentorshipId, senderId, text });
            await newMessage.save();

            // Broadcast message back to everyone in the room
            io.to(mentorshipId).emit('receive_message', newMessage);
        } catch (error) {
            console.error('Socket send_message error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/quiz', aiQuizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/plagiarism', plagiarismRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('EduTrack API is running');
});

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
