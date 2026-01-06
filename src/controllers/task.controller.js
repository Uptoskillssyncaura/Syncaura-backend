import Task from "../models/task.model.js";

/**
 * CREATE TASK
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, deadline,status } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      deadline,
      status: status || "TODO"
    }); 
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL TASKS
 */
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE TASK
 */
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TASK (Edit option)
 */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE TASK
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * UPDATE TASK STATUS
 * Only assigned user or admin can update status
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status, user, role } = req.body;

    // validate status
    const allowedStatus = ["TODO", "IN_PROGRESS", "DONE"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // authorization check
    if (role !== "admin" && task.assignedTo !== user) {
      return res
        .status(403)
        .json({ message: "Not authorized to update task status" });
    }

    task.status = status;
    await task.save();

    res.json({
      message: "Task status updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};