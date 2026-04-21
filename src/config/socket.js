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

    // Handle text messages
    socket.on("message:text", async ({ channelId, senderId, text }) => {
    const channel = await Channel.findById(channelId);
    if (!channel) return;

    if (channel.isPrivate && !channel.allowedUsers.includes(senderId)) {
      socket.emit("error", "Not allowed to send message");
      return;
    }

    const message = await Message.create({
      channelId,
      senderId,
      text,
      messageType: "text",
    });

    io.to(channelId).emit("message:new", message);
  });

  // Handle file messages
  socket.on("message:file", async ({ channelId, senderId, fileUrl }) => {
    const channel = await Channel.findById(channelId);
    if (!channel) return;

    if (channel.isPrivate && !channel.allowedUsers.includes(senderId)) {
      socket.emit("error", "Not allowed");
      return;
    }

    const message = await Message.create({
      channelId,
      senderId,
      fileUrl,
      messageType: "file",
    });

    io.to(channelId).emit("message:new", message);
  });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default socketHandler;