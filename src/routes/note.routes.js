import express from "express";
import {addNote,getNotesByMeeting} from "../controllers/noteController.js";
const router =express.Router();

router.post("/",addNote);
router.get("/:meetingId",getNotesByMeeting);

export default router; 