import Message from "../models/Message.js";
import Channel from "../models/Channel.js";

export const sendMediaMessage = async (req,res)=>{
    try{
        const {channelId}=req.body;
        const senderId=req.user._id;

        const channel=await Channel.findById(channelId);
        if(!channel){
            return res.status(404).json({message:"Channel not found"});
        }
        if(channel.isPrivate && !channel.allowedUsers.includes(senderId))
        {
            return res.status(403).json({message:"Not allowed"});
        }

        const message=await Message.create({
            channelId,
            senderId,
            messageType:"file",
            fileUrl:`/uploads/chat/${req.file.filename}`,
        });
        res.status(201).json(message);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};