import express from "express";
import { auth } from "../middlewares/auth.js"; // your auth middleware
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();
router.post("/", auth, createMeeting);
router.get("/", auth, getMeetings);
router.get("/:id", auth, getMeetingById);
router.put("/:id", auth, updateMeeting);
router.delete("/:id", auth, deleteMeeting);

export default router;
