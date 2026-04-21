import ExportFile from "../models/CanvaExportFile.js";
import { exportTemplate, checkExportStatus } from "../services/canvaService.js";

export const handleExport = async (req, res) => {
  // console.log("HEADERS:", req.headers);
  // console.log("BODY:", req.body);

  console.log(req.body);
  try {
    // input validation
    const { templateId, format } = req.body;

    if (!templateId || !format) {
      return res.status(400).json({ message: "templateId & format required" });
    }

    const upperFormat = format.toUpperCase();

    if (!["PDF", "PNG"].includes(upperFormat)) {
      return res.status(400).json({ message: "Format must be PDF or PNG" });
    }

    /*
      POSTMAN REQUEST
      URL: http://localhost:{PORT}/api/canva/export
      BODY (JSON):
      {
      "templateId": "your-canva-design-id",
      "format": "pdf or png"
      }
    */

    // Canva Export
    const job = await exportTemplate(templateId, upperFormat);

    let exportData;

    while (true) {
      const status = await checkExportStatus(job.id);

      if (status.status === "success") {
        exportData = status;
        break;
      }

      if (status.status === "failed") {
        throw new Error("Canva export failed");
      }

      await new Promise(r => setTimeout(r, 1500));
    }

    // console.log("CANVA STATUS:", exportData);

    const downloadUrl =
      Array.isArray(exportData.urls)
        ? exportData.urls[0]
        : exportData.urls?.download_url;

    if (!downloadUrl) {
      console.log("FULL RESPONSE:", exportData);
      throw new Error("No download URL from Canva");
    }

    // Unique filename
    const filename = `${templateId}-${Date.now()}.${upperFormat.toLowerCase()}`;

    // const fileUrl = `${process.env.BASE_URL}/files/${filename}`;

    // Save in MongoDB
    const savedRecord = await ExportFile.create({
      templateId,
      format: upperFormat,
      filename,
      // url: fileUrl,
      canvaUrl: downloadUrl,
    });

    return res.json({
      message: "Export success",
      file: savedRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};