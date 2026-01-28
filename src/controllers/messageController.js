import Message from "../models/Message.js";
import Channel from "../models/Channel.js";

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { channelId, text}=req.body;

    // Validation: content
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Validation: channel exists
    const channel = await Channel.findById(channelId);
    console.log("REQ USER", req.user);
    console.log("CHANNEL MEMBERS", channel.members);

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Validation: user is channel member
    const isMember=channel.members.some((memberId)=>memberId.toString()=== req.user.id);
    if(!isMember){
      return res.status(403).json({message:"Not a channel member"});
    }

    // Save message
    const message = await Message.create({
      channelId,
      senderId: userId,
      text
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Messages
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.members.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ channelId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};