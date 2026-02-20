const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "MANAGER", "EMPLOYEE"], required: true },
    eventType: {
      type: String,
      enum: ["LOGIN", "LOGOUT", "CHECK_IN", "CHECK_OUT"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
