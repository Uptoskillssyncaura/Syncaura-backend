import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import ROLES from '../config/roles.js';
import {
  notifyAdminsAboutComplaint,
  notifyUserAboutComplaint
} from '../utils/notifications.js';

/**
 * Create a new complaint
 * POST /api/complaints
 */
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, severity, priority, isAnonymous, attachments } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      severity: severity || 'medium',
      priority: priority || 'normal',
      isAnonymous: isAnonymous || false,
      attachments: attachments || [],
      filedBy: req.user.id
    });

    // Populate user info
    await complaint.populate('filedBy', 'name email role');

    // Notify admins about new complaint
    try {
      await notifyAdminsAboutComplaint(complaint, 'created');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the request due to notification error
    }

    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all complaints with filters (Admin/Co-admin only)
 * GET /api/complaints
 */
export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, severity, priority, sortBy = '-createdAt', limit = 20, page = 1 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('filedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints filed by current user
 * GET /api/complaints/my-complaints
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    const { status, sortBy = '-createdAt', limit = 20, page = 1 } = req.query;

    const filter = { filedBy: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('assignedTo', 'name email')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single complaint by ID
 * GET /api/complaints/:id
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('filedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization - user can only view their own complaint or admins can view any
    if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.CO_ADMIN) {
      if (complaint.filedBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view this complaint'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint status (Admin/Co-admin only)
 * PATCH /api/complaints/:id/status
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateData = { status };
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
      if (resolution) updateData.resolution = resolution;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('filedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Notify the user who filed the complaint
    try {
      await notifyUserAboutComplaint(complaint.filedBy._id, complaint, 'status_updated');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Assign complaint to a handler (Admin/Co-admin only)
 * PATCH /api/complaints/:id/assign
 */
export const assignComplaint = async (req, res, next) => {
  try {
    const { assignedToId } = req.body;

    if (!assignedToId) {
      return res.status(400).json({
        success: false,
        message: 'assignedToId is required'
      });
    }

    // Verify the user exists and has appropriate role
    const handler = await User.findById(assignedToId);
    if (!handler) {
      return res.status(404).json({
        success: false,
        message: 'Handler not found'
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: assignedToId, status: 'in-progress' },
      { new: true, runValidators: true }
    ).populate('filedBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Notify the user who filed the complaint
    try {
      await notifyUserAboutComplaint(complaint.filedBy._id, complaint, 'assigned');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add comment to complaint
 * POST /api/complaints/:id/comments
 */
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization
    const isAdmin = req.user.role === ROLES.ADMIN || req.user.role === ROLES.CO_ADMIN;
    const isFiler = complaint.filedBy.toString() === req.user.id;

    if (!isAdmin && !isFiler) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to comment on this complaint'
      });
    }

    complaint.comments.push({
      user: req.user.id,
      text: text.trim()
    });

    await complaint.save();
    await complaint.populate('comments.user', 'name email role');

    // Notify the filer about new comment
    try {
      if (isFiler && !isAdmin) {
        // Notify admins if comment is from user
        const admins = await User.find({ role: { $in: [ROLES.ADMIN, ROLES.CO_ADMIN] } });
        const adminIds = admins.map(admin => admin._id);
        
        // Create custom notification for admins
        const { createNotification } = await import('../utils/notifications.js');
        await createNotification({
          type: 'complaint_commented',
          title: `Comment on Complaint: ${complaint.title}`,
          message: `The complaint filer has commented on: "${complaint.title}"`,
          recipients: adminIds,
          relatedEntity: {
            entityType: 'complaint',
            entityId: complaint._id
          },
          actionUrl: `/complaints/${complaint._id}`
        });
      } else {
        // Notify filer if admin/handler comments
        await notifyUserAboutComplaint(complaint.filedBy, complaint, 'commented');
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint (Admin/Co-admin only, limited fields)
 * PATCH /api/complaints/:id
 */
export const updateComplaint = async (req, res, next) => {
  try {
    const { title, description, category, severity, priority,status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (severity) updateData.severity = severity;
    if (priority) updateData.priority = priority;
    if (status && (req.user.role === ROLES.ADMIN || req.user.role === ROLES.CO_ADMIN)) {
    updateData.status = status;
}

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('filedBy', 'name email').populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete complaint (Admin/Co-admin only)
 * DELETE /api/complaints/:id
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint statistics (Admin/Co-admin only)
 * GET /api/complaints/stats
 */
export const getComplaintStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const byStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const bySeverity = await Complaint.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus,
        byCategory,
        bySeverity
      }
    });
  } catch (error) {
    next(error);
  }
};
