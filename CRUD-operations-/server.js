import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import taskRoutes from "./routes/task.routes.js";
import noticeRoutes from "./routes/notice.routes.js"; // ✅ ADD THIS

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// connect database
connectDB();

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/notices", noticeRoutes); // ✅ ADD THIS

// start
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
