import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
  type: String,
  enum: ["TODO", "IN_PROGRESS", "DONE"],
  default: "TODO"
},

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    assignedTo: {
      type: String
    },
    deadline: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
