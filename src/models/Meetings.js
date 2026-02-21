import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    participants: {
      type: [String], // emails
      default: [],
    },

    // which platform the meeting is scheduled on
    platform: {
      type: String,
      enum: ["Google Meet", "Zoom", "Teams"],
      default: "Google Meet",
    },

    // fields used when a Google meeting is created
    googleEventId: {
      type: String,
    },
    googleMeetLink: {
      type: String,
    },

    // fields used when a Zoom meeting is created
    zoomMeetingId: {
      type: String,
    },
    zoomPassword: {
      type: String,
    },
    zoomJoinUrl: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
