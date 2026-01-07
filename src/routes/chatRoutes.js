import express from "express";
import { sendMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

// Get all messages
router.get("/", getMessages);

// Send a new message
router.post("/send", sendMessage);

export default router;
