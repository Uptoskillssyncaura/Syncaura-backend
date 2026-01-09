import Meeting from "../models/Meetings.js";
import  {createCalendarEvent}  from "../services/googleCalendar.js";

export const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, participants } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const calendarEvent = await createCalendarEvent(req.body);

    const meeting = await Meeting.create({
      title,
      description,
      startTime,
      endTime,
      participants,
      googleEventId: calendarEvent.id,
    });

    res.status(201).json({
      message: "Meeting created & synced with Google Calendar",
      meeting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};