import Note from "../models/Note.js";
import Meeting from "../models/Meetings.js";
export const addNote=async (req,res)=>{
    try{
        const {meetingId}=req.body;
        const meeting =await Meeting.findById(meetingId);
        if(!meeting){
            return res.status(404).json({message:"Meeting not found"});
        }
        if(meeting.createdBy.toString()!==req.user.id){
            return res.status(403).json({message:"You are not allowed"});
        }

        const note=await Note.create(req.body);
        res.status(201).json(note);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

export const getNotesByMeeting=async (req,res)=>{
    try{
         const {meetingId}=req.params;
        const meeting =await Meeting.findById(meetingId);
        if(!meeting){
            return res.status(404).json({message:"Meeting not found"});
        }
        if(meeting.createdBy.toString()!==req.user.id){
            return res.status(403).json({message:"You are not allowed"});
        }
        const notes=await Note.find({meetingId:req.params.meetingId});
        res.json(notes);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};