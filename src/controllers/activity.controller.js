const Activity = require("../models/Activity.model");

exports.logActivity = async (req, res) => {
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

exports.getActivities = async (req, res) => {
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
exports.testData = async (req, res) => {
  await Activity.create({
    userId: "USER_001",
    role: "EMPLOYEE",
    eventType: "LOGIN",
  });

  res.json({
    success: true,
    message: "Sample activity inserted successfully"
  });
};

