import Message from "../models/Message.js";
import Channel from "../models/Channel.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-channel", async({channelId,userId }) => {
      const channel = await Channel.findById(channelId);
      if(!channel){
        socket.emit("error","Channel not found");
        return;
      }
      if(
        channel.isPrivate &&
        !channel.allowedUsers.includes(userId)
      ){
        socket.emit("error","Not allowed to join this private chat");
        return;
      }
      socket.join(channelId);
    });

    socket.on("leave-channel", (channelId) => {
      socket.leave(channelId);
    });


    socket.on("send-message", async ({ channelId, senderId, content }) => {
      try {
        // 1️⃣ Validate message content
        if (!content || content.trim() === "") return;

    socket.on("send-message", async ({ channelId, senderId, text }) => {
      const channel=await Channel.findById(channelId);
      if(!channel)return;
      if(channel.isPrivate && !channel.allowedUsers.includes(senderId))
      {
        socket.emit("error","Not allowed to send message");
        return;
      }
      
      
      const message = await Message.create({
        channelId,
        senderId,
        text,
        messageType:"text",
      });


        // 2️⃣ Check channel exists
        const channel = await Channel.findById(channelId);
        if (!channel) return;

        // 3️⃣ Check user is channel member
        if (!channel.members.includes(senderId)) return;

        // 4️⃣ Save message to DB
        const message = await Message.create({
          channelId,
          senderId,
          content,
        });

        // 5️⃣ Emit message to channel room
        io.to(channelId).emit("new-message", message);

      } catch (error) {
        console.error("Socket send-message error:", error);
      }
    });

    socket.on("send-media-message",async({channelId,senderId,fileUrl}) =>{
      const channel=await Channel.findById(channelId);
      if(!channel)return;
      if(channel.isPrivate && !channel.allowedUsers.includes(senderId))
      {
        socket.emit("error","Not allowed");
        return;
      }
      const message=await message.create({
        channelId,
        senderId,
        messageType:"file",
        fileUrl,
      });
      io.to(channelId).emit("new-message",message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;