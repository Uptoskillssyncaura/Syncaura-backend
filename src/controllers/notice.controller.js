import Notice from "../models/notice.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE notice with attachments
export const createNotice = async (req, res) => {
  try {
    const files = req.files?.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      uploadedAt: new Date()
    })) || [];

    const notice = await Notice.create({
      ...req.body,
      attachments: files
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../../public/uploads', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single notice by ID
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE notice (add new attachments)
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    const files = req.files?.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      uploadedAt: new Date()
    })) || [];

    notice.title = req.body.title || notice.title;
    notice.description = req.body.description || notice.description;
    
    // Add new files to attachments
    if (files.length > 0) {
      notice.attachments.push(...files);
    }

    await notice.save();
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../../public/uploads', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// VIEW/STREAM attachment (for viewing in browser)
export const viewAttachment = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    const attachment = notice.attachments.find(att => att.fileName === fileName);
    if (!attachment) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }

    const filePath = path.join(__dirname, '../../public', attachment.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }

    // Set appropriate headers for inline viewing
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      res.status(500).json({ success: false, message: "Error reading file" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DOWNLOAD attachment
export const downloadAttachment = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    const attachment = notice.attachments.find(att => att.fileName === fileName);
    if (!attachment) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }

    const filePath = path.join(__dirname, '../../public', attachment.fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }

    res.download(filePath, attachment.fileName, (err) => {
      if (err && err.code !== 'ERR_HTTP_HEADERS_SENT') {
        res.status(500).json({ success: false, message: "Error downloading file" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE specific attachment
export const deleteAttachment = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    const attachment = notice.attachments.find(att => att.fileName === fileName);
    if (!attachment) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }

    // Remove from DB
    notice.attachments = notice.attachments.filter(att => att.fileName !== fileName);
    await notice.save();

    // Remove from filesystem
    const filePath = path.join(__dirname, '../../public', attachment.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: "Attachment deleted successfully", data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE notice (with attachments cleanup)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    // Remove all attachments from filesystem
    notice.attachments.forEach(att => {
      const filePath = path.join(__dirname, '../../public', att.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.status(200).json({ success: true, message: "Notice and attachments deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
