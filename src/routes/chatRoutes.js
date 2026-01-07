import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// Get all messages of a channel
router.get("/:channelId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ channelId: req.params.channelId });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new message
router.post("/", async (req, res) => {
  const newMessage = new ChatMessage(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
