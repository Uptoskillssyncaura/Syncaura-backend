import Note from "../models/Note.js";
import mongoose from "mongoose";


import Meeting from "../models/Meetings.js";


export const addNote = async (req, res) => {
  try {
    const { meetingId, content } = req.body;

    // ✅ meetingId validation
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: "Invalid meetingId" });
    }

    
    const meeting = await Meeting.findById(meetingId);
if (!meeting) {
  return res.status(404).json({ message: "Meeting not found" });
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

};

