import Channel from "../models/Channel.js";
import User from "../models/User.js";

// Create Channel (Admin / Co-Admin)
export const createChannel = async (req, res) => {
  try {
    const { name } = req.body;

    const channel = await Channel.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    // add channel to user
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { channels: channel._id },
    });

    res.status(201).json({ message: "Channel created", channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Join Channel
export const joinChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

console.log("User trying to join:", userId);
console.log("Channel ID:", channelId);

   
    const channel = await Channel.findById(channelId);
      console.log("Found channel:", channel);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.members.length >= channel.maxMembers) {
      return res.status(403).json({
        message: "Channel is full (max 5 users)",
      });
    }

    if (channel.members.includes(userId)) {
      return res.status(400).json({ message: "Already joined" });
    }


console.log("Current members:", channel.members.map(m => m.toString()));



    channel.members.push(userId);
    await channel.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { channels: channelId },
    });

    res.json({ message: "Joined channel successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 export const getChannels=async (req,res)=>{
      const channels=await Channel.find({
        members:req.user.id
      });
      res.status(200).json(channels);
    };


// Leave Channel
export const leaveChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    await Channel.findByIdAndUpdate(channelId, {
      $pull: { members: userId },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { channels: channelId },
    });

    res.json({ message: "Left channel successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//find By id

export const getChannelById=async (req,res)=>{
  try{
    const channel=await Channel.findById(req.params.id);
    if(!channel){
      return res.status(404).json({message:"Channel not found"});
   }
  }catch(err){
  res.status(500).json({message:err.message});
  }

}
