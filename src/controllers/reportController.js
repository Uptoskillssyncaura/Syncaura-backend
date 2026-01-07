import Task from "../models/task.model.js";
import Document from "../models/Document.js";
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

// GET project-wise progress
export const getProjectProgress = async (req, res) => {
  try {
    // Example: group tasks by project
    const tasks = await Task.find();
    const projects = {};

    tasks.forEach(task => {
       if (!task.projectId) return;
      const pid = task.projectId.toString();
      if (!projects[pid]) projects[pid] = { total: 0, completed: 0, inProgress: 0, todo: 0 };
      projects[pid].total++;
      if (task.status === "DONE") projects[pid].completed++;
      else if (task.status === "IN_PROGRESS") projects[pid].inProgress++;
      else projects[pid].todo++;
    });

    // calculate progress %
    Object.keys(projects).forEach(pid => {
      projects[pid].progressPercent = projects[pid].total
        ? (projects[pid].completed / projects[pid].total) * 100
        : 0;
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET document summary (per project)
export const getDocumentSummary = async (req, res) => {
  try {
    const documents = await Document.find();
    const summary = {};

    documents.forEach(doc => {
      const pid = doc.projectId.toString();
      if (!summary[pid]) summary[pid] = [];
      summary[pid].push({
        title: doc.title,
        versionsCount: doc.versions.length,
        lastUpdated: doc.updatedAt
      });
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};