import express from "express";

import auth from "../middlewares/auth.js";
import { addAttachment,getAttachmentsByMeeting } from "../controllers/attachmentController.js";

import { addAttachment,getAttachmentsByMeeting } from "../controllers/attachmentController.js";
import { auth } from "../middlewares/auth.js";

const router=express.Router();

router.post("/",auth,addAttachment);
router.get("/:meetingId",auth,getAttachmentsByMeeting);

export default router;