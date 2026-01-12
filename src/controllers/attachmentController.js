import Attachment from "../models/Attachment.js";

export const addAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.create(req.body);
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttachmentsByMeeting = async (req, res) => {
  try {
    const attachments = await Attachment.find({
      meetingId: req.params.meetingId,
    });
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};