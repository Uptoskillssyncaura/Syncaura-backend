import express from "express";

import Meeting from "../models/Meetings.js";
import { createMeeting ,updateMeeting,deleteMeeting} from "../controllers/meetingController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// ✅ CREATE MEETING (MongoDB + Google Calendar)
router.post("/", auth, createMeeting);

// GET ALL MEETINGS
router.get("/",auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({createdBy:req.user.id});
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MEETING BY ID
router.get("/:id",auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({_id: req.params.id,createdBy: req.user.id});
    if (!meeting) return res.status(404).json({ message: "Not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE MEETING
router.put("/:id", auth,updateMeeting);

// DELETE MEETING
router.delete("/:id", auth,deleteMeeting);

export default router;

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

