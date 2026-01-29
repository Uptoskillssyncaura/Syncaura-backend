import express from "express";
import upload from "../middlewares/upload.js";
import { sendMediaMessage } from "../controllers/messageController.js";
import { auth } from "../middlewares/auth.js";

const router=express.Router();
router.post(
    "/send-media",
    auth,
    upload.single("file"),
    sendMediaMessage
);

export default router;