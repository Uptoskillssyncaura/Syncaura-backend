import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// connect database
connectDB();

// routes
import taskRoutes from "./routes/task.routes.js";
app.use("/api/tasks", taskRoutes);

// start
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
