import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/task.routes.js';
import {errorMiddleware} from './middlewares/errorHandler.js';
import channelRoutes from './routes/channelRoutes.js';
import noticeRoutes from "./routes/notice.routes.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import noteRoutes from "./routes/note.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";


dotenv.config();

const app = express();

// Connect Database
connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use("/api/meetings", meetingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/notices", noticeRoutes);
app.use('/api/channels', channelRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/attachments",attachmentRoutes);
app.use("/api/notes",noteRoutes);
// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use(errorMiddleware);

export default app;
