import Meeting from "../models/Meetings.js";
import { createCalendarEvent } from "../services/googleCalendar.js";
import mongoose from "mongoose";

// ✅ Create meeting
export const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let calendarEvent = null;

    try {
      calendarEvent = await createCalendarEvent({
        title,
        description,
        startTime,
        endTime,
      });
    } catch (err) {
      console.warn("Calendar sync failed:", err.message);
    }

    const meeting = await Meeting.create({
      title,
      description,
      startTime,
      endTime,
      googleEventId: calendarEvent?.id || null,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get all meetings
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single meeting
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const meeting = await Meeting.findById(id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update meeting
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const meeting = await Meeting.findByIdAndUpdate(id, req.body, { new: true });
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete meeting
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const meeting = await Meeting.findByIdAndDelete(id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    res.json({ message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};