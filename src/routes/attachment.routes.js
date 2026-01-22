import express from "express";
import { addAttachment,getAttachmentsByMeeting } from "../controllers/attachmentController.js";
const router=express.Router();

router.post("/",addAttachment);
router.get("/:meetingId",getAttachmentsByMeeting);

export default router;