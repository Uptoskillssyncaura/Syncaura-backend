import Attachment from "../models/Attachment.js";
import Meeting from "../models/Meetings.js";

export const addAttachment = async (req, res) => {
  try {
    const {meetingId}=req.body;
    const meeting=await Meeting.findById(meetingId);
    if(!meeting){
      return res.status(404).json({message:"Meeting not found"});
    }

    if(meeting.createdBy.toString()!==req.user.id){
      return res.status(403).json({message:"You are not allowed"});
    }

    const attachment = await Attachment.create(req.body);
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttachmentsByMeeting = async (req, res) => {
  try {
      const {meetingId}=req.params;
    const meeting=await Meeting.findById(meetingId);
    if(!meeting){
      return res.status(404).json({message:"Meeting not found"});
    }

    if(meeting.createdBy.toString()!==req.user.id){
      return res.status(403).json({message:"You are not allowed"});
    }

    const attachments = await Attachment.find({
      meetingId: req.params.meetingId,
    });
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};