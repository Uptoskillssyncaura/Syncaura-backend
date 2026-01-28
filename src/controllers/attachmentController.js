import Attachment from "../models/Attachment.js";
import mongoose from "mongoose";
import Meeting from "../models/Meetings.js";


export const addAttachment = async (req, res) => {
  try {
    const { meetingId, fileName, fileUrl } = req.body;

    // ✅ meetingId validation
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: "Invalid meetingId" });
    }
      const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const attachment = await Attachment.create({
      meetingId,
      fileName,
      fileUrl,
    });

    res.status(201).json(attachment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttachmentsByMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    // ✅ validation for GET
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: "Invalid meetingId" });
    }

    const attachments = await Attachment.find({ meetingId });
    res.json(attachments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
