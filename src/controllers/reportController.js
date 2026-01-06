import Task from "../models/task.model.js";

/**
 * GET TASK REPORT
 * Filters: projectId, status, priority
 */
export const getTaskReport = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    // Build query object dynamically
    const query = {};
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query);

    // Calculate summary
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "DONE").length;
    const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length;
    const todoTasks = tasks.filter(t => t.status === "TODO").length;
    const progressPercent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progressPercent,
      tasks, // optional, return full task list
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
