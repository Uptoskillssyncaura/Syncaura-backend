import Meeting from "../models/Meetings.js";
import  {createCalendarEvent,updateCalendarEvent,deleteCalendarEvent}  from "../services/googleCalendar.js";

export const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, participants } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const calendarEvent = await createCalendarEvent({
      title,
       description, 
       startTime,
      endTime, 
      participants:participants||[],
    });

    const meeting = await Meeting.create({
      title,
      description,
      startTime,
      endTime,
      participants,
      googleEventId: calendarEvent.id,
      createdBy:req.user.id,
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

export const updateMeeting=async(req,res) =>{
  try{
    const meeting=await Meeting.findById(req.params.id);
    if(!meeting){
      return res.status(404).json({message:"Meeting not found"});
    }
    if(meeting.createdBy.toString()!==req.user.id){
      return res.status(403).json({message:"Not authorized"});
    }
    const updatedMeeting=await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    if(meeting.googleEventId){
      await updateCalendarEvent(meeting.googleEventId,req.body);
    }
    res.json({message:"Meeting updated & calendar synced,",meeting:updatedMeeting,});
  }catch(error){
    res.status(500).json({message:"Server error"});
  }
};

export const deleteMeeting=async (req,res)=>{
  try{
    const meeting=await Meeting.findById(req.params.id);
    if(!meeting){
      return res.status(404).json({message:"Meeting not found"});
    }
    if(meeting.createdBy.toString()!== req.user.id){
      return res.status(403).json({message:"Not authorized"});
    }

    if(meeting.googleEventId){
      await deleteCalendarEvent(meeting.googleEventId);
    }
    await meeting.deleteOne();

    res.json({message:"Meeting deleted & calendar deleted"})

  }catch(error){
    res.status(500).json({message:"Server error"});
  }
}