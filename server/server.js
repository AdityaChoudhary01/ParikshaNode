import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http'; // Feature 3: NEW
import { Server } from 'socket.io'; // Feature 3: NEW
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { seedAchievements } from './utils/achievementService.js'; // Feature 2: NEW
import quizSocketHandler from './socket/quizHandler.js'; // Feature 3: NEW

connectDB();
seedAchievements(); // Feature 2: Seed achievements on connection

const app = express();
const httpServer = createServer(app); // Feature 3: Use createServer

// --- START: Feature 3: Socket.IO Setup ---
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? 'https://parikshanode.netlify.app' : 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    quizSocketHandler(io, socket); // Initialize quiz room handlers
});
// --- END: Feature 3: Socket.IO Setup ---

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API is running...'));

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
// Use httpServer.listen instead of app.listen
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode with Sockets`));
