import Task from '../models/task.model.js';

export const completionRate = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'DONE' });

    return res.status(200).json({
      totalTasks: total,
      completedTasks: completed,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const burndownData = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId required" });

    // Fetch all tasks for the project, sorted by creation date
    const tasks = await Task.find({ projectId }).sort({ createdAt: 1 });

    if (!tasks.length) return res.json([]);

    // Get all unique dates from task createdAt
    const dates = [...new Set(tasks.map(t => t.createdAt.toISOString().split('T')[0]))];
    
    let remainingTasks = tasks.length;
    const result = [];

    // Loop through each date
    for (let date of dates) {
      // Count tasks completed up to this date
      const completedUpToDate = tasks.filter(
        t => t.status === 'DONE' && t.createdAt.toISOString().split('T')[0] <= date
      ).length;

      result.push({
        date,
        remaining: remainingTasks - completedUpToDate
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const workload = async (req, res) => {
  try {
    const result = await Task.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          taskCount: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myWorkload = async (req, res) => {
    console.log("Logged-in user:", req.user);

  try {
    const userId = req.user.id;

    const tasks = await Task.find({ assignedTo: userId });

    res.status(200).json({
      totalTasks: tasks.length,
      pending: tasks.filter(t => t.status !== 'DONE').length,
      completed: tasks.filter(t => t.status === 'DONE').length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
