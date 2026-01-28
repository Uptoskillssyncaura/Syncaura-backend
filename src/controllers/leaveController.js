import Leave from '../models/Leave.js';

export const applyLeave = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== 'user') {
      return res.status(403).json({ message: "Only users can apply leave" });
    }

    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: "fromDate, toDate and reason are required"
      });
    }

 
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD"
      });
    }

 
    const today = new Date();
    today.setHours(0, 0, 0, 0);

 
    if (from < today) {
      return res.status(400).json({
        message: "fromDate cannot be before today"
      });
    }

 
    if (to < from) {
      return res.status(400).json({
        message: "toDate cannot be before fromDate"
      });
    }

    const newLeave = await Leave.create({
      user: req.user.id,
      fromDate: from,
      toDate: to,
      reason
    });

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: newLeave
    });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({ message: "Error applying leave" });
  }
};


export const getMyLeaves = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const role = req.user.role;

    if (!['user', 'admin', 'coadmin'].includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.user.id;
    const leaves = await Leave.find({ user: userId });

    if (leaves.length === 0) {
      return res.status(404).json({ message: "No leaves found" });
    }

    res.status(200).json({ leaves });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!['admin', 'coadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const leaves = await Leave.find();

    if (leaves.length === 0) {
      return res.status(404).json({ message: "No leaves found" });
    }

    res.status(200).json({ leaves });
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

export const approveLeave = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!['admin', 'coadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = 'approved';
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();

    await leave.save();

    res.status(200).json({ message: "Leave approved successfully" });
  } catch (error) {
    console.error("Error approving leave:", error);
    res.status(500).json({ message: "Error approving leave" });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!['admin', 'coadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: "Leave already reviewed" });
    }

    leave.status = 'rejected';
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();

    await leave.save();

    res.status(200).json({ message: "Leave rejected successfully" });
  } catch (error) {
    console.error("Error rejecting leave:", error);
    res.status(500).json({ message: "Error rejecting leave" });
  }
};
