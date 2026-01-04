const Notice = require('../models/notice.model');

const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, author: req.user.id });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('author', 'name email');
    if (!notice) return res.status(404).json({ message: 'Not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotice, getNotices, getNotice, updateNotice, deleteNotice };
