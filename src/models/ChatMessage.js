const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: String,
    text: String,
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", ChatmessageSchema);
