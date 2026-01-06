import express from "express";
const router = express.Router();
import { getTaskReport } from "../controllers/reportController.js";
import { auth } from "../middlewares/auth.js";

// Protected route
router.get("/tasks", auth, getTaskReport);

export default router;
