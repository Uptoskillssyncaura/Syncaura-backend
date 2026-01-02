import Channel from "../models/Channel.js";

// Create Channel (Admin / Co-Admin)
export const createChannel = async (req, res) => {
  const { name } = req.body;

  const channel = await Channel.create({
    name,
    createdBy: req.user.id,
    members: [req.user.id],
  });

  res.status(201).json({ message: "Channel created", channel });
};

// Join Channel
export const joinChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  if (!channel) return res.status(404).json({ message: "Channel not found" });

  if (!channel.members.includes(req.user.id)) {
    channel.members.push(req.user.id);
    await channel.save();
  }

  res.json({ message: "Joined channel" });
};

// Leave Channel
export const leaveChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  channel.members = channel.members.filter(
    id => id.toString() !== req.user.id
  );

  await channel.save();
  res.json({ message: "Left channel" });
};