import express from "express";
import Meeting from "../models/Meetings.js";
import { createMeeting } from "../controllers/meetingController.js";

const router = express.Router();

// ✅ CREATE MEETING (MongoDB + Google Calendar)
router.post("/", createMeeting);

// GET ALL MEETINGS
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MEETING BY ID
router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE MEETING
router.put("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE MEETING
router.delete("/:id", async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;