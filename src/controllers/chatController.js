import ChatMessage from "../models/ChatMessage.js";

// Send message
export const sendMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
