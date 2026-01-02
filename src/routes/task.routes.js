import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", createTask); // Create Task
router.get("/", getAllTasks); // Get All Tasks
router.get("/:id", getTaskById); // Get Single Task
router.put("/:id", updateTask); // Update Task
router.delete("/:id", deleteTask); // Delete Task

export default router;
