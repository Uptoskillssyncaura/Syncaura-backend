import Notification from '../models/Notification.js';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification } from '../utils/notifications.js';

/**
 * Get notifications for current user
 * GET /api/notifications
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, isRead } = req.query;
    
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      isRead: isRead ? isRead === 'true' : null
    };

    const { notifications, total } = await getUserNotifications(req.user.id, options);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications count
 * GET /api/notifications/unread/count
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/mark-all-read
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const result = await markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const removeNotification = async (req, res, next) => {
  try {
    // Verify the notification belongs to the user
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this notification'
      });
    }

    await deleteNotification(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all notifications for user
 * DELETE /api/notifications/clear
 */
export const clearAllNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({ recipient: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All notifications cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};
