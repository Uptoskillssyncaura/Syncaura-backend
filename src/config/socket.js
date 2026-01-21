import Message from "../models/Message.js";
import Channel from "../models/Channel.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-channel", (channelId) => {
      socket.join(channelId);
    });

    socket.on("leave-channel", (channelId) => {
      socket.leave(channelId);
    });

    socket.on("send-message", async ({ channelId, senderId, content }) => {
      try {
        // 1️⃣ Validate message content
        if (!content || content.trim() === "") return;

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

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;