import Note from "../models/Note.js";
export const addNote=async (req,res)=>{
    try{
        const note=await Note.create(req.body);
        res.status(201).json(note);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

export const getNotesByMeeting=async (req,res)=>{
    try{
        const notes=await Note.find({meetingId:req.params.meetingId});
        res.json(notes);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};