import Activity from "../models/Activity.model.js";

export const logActivity = async (req, res) => {
  try {
    const { eventType } = req.body;

    const activity = await Activity.create({
      userId: req.user.id,
      role: req.user.role,
      eventType,
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "EMPLOYEE") {
      filter.userId = req.user.id;
    }

    const activities = await Activity.find(filter).sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const testData = async (req, res) => {
  try {
    await Activity.create({
      userId: "USER_001",
      role: "EMPLOYEE",
      eventType: "LOGIN",
    });

    res.json({
      success: true,
      message: "Sample activity inserted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};