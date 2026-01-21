import Note from "../models/Note.js";
import mongoose from "mongoose";

export const addNote = async (req, res) => {
  try {
    const { meetingId, content } = req.body;

    // ✅ meetingId validation
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: "Invalid meetingId" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const note = await Note.create({ meetingId, content });
    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotesByMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    // ✅ validation for GET
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: "Invalid meetingId" });
    }

    const notes = await Note.find({ meetingId });
    res.json(notes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};