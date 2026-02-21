import Meeting from "../models/Meetings.js";
import mongoose from "mongoose";
// ✅ Create meeting
import { getCalendarClient } from "../utils/googleAuth.js";
import { createZoomMeeting } from "../utils/zoom.js";

export const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, platform = "Google Meet" } = req.body;

    // determine duration (minutes) for services that require it
    const duration = Math.ceil((new Date(endTime) - new Date(startTime)) / 60000);

    // base object that will be saved to database
    const meetingData = {
      title,
      description,
      startTime,
      endTime,
      platform,
      createdBy: req.user ? req.user._id : undefined,
    };

    if (platform === "Google Meet") {
      const tokens = req.googleTokens;
      if (!tokens) {
        return res.status(403).json({ message: "Google account not connected" });
      }

      const calendar = getCalendarClient(tokens);
      const event = {
        summary: title,
        description,
        start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
        end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
        conferenceData: { createRequest: { requestId: "syncaura-" + Date.now() } },
      };

      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });

      meetingData.googleEventId = response.data.id;
      meetingData.googleMeetLink = response.data.hangoutLink;
    } else if (platform === "Zoom") {
      // require zoom credentials in env
      if (!process.env.ZOOM_API_KEY || !process.env.ZOOM_API_SECRET) {
        return res.status(500).json({ message: "Zoom API credentials not configured" });
      }

      const zoomResult = await createZoomMeeting({
        topic: title,
        startTime,
        duration,
      });

      meetingData.zoomMeetingId = zoomResult.id;
      meetingData.zoomPassword = zoomResult.password;
      meetingData.zoomJoinUrl = zoomResult.join_url;
    }

    const meeting = new Meeting(meetingData);
    await meeting.save();

    return res.status(201).json({ meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Meeting creation failed" });
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
