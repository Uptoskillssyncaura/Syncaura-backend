import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/task.routes.js';
import {errorMiddleware} from './middlewares/errorHandler.js';
import channelRoutes from './routes/channelRoutes.js';
import noticeRoutes from "./routes/notice.routes.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from './routes/dashboardRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js'
import noteRoutes from "./routes/note.routes.js";
import attachmentRoutes from "./routes/attachment.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import calendarTestRoute from "./routes/calendarTest.route.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
connectDB();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/notices", noticeRoutes);
app.use('/api/channels', channelRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes);
 main
app.use("/api/chat", chatRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leave', leaveRoutes);
app.use("/api/attachments",attachmentRoutes);
app.use("/api/notes",noteRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api", calendarTestRoute);
main
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
app.use(errorMiddleware);
export default app;
