import Notice from "../models/notice.model.js";
import { notifyAllUsersAboutNotice } from "../utils/notifications.js";

//  CREATE notice
export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    
    // Send notifications to all users about the new notice
    try {
      await notifyAllUsersAboutNotice(notice);
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the request due to notification error
    }
    
    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  GET all notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  UPDATE notice
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  DELETE notice
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
