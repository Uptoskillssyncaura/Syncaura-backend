import mongoose from "mongoose";

const exportFileSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true },
    format: { type: String, required: true },
    filename: { type: String, required: true },
    // url: { type: String, required: true },
    canvaUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("CanvaExportFile", exportFileSchema);