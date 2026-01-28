import express from "express";
import {addNote,getNotesByMeeting} from "../controllers/noteController.js";

import auth from "../middlewares/auth.js";
const router =express.Router();

router.post("/",auth,addNote);
router.get("/:meetingId",auth,getNotesByMeeting);

const router =express.Router();

router.post("/",addNote);
router.get("/:meetingId",getNotesByMeeting);


export default router; 