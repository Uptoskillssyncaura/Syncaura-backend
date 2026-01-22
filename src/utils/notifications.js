import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Create and send a notification to users
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.type - Type of notification
 * @param {string} notificationData.title - Notification title
 * @param {string} notificationData.message - Notification message
 * @param {Array|string} notificationData.recipients - User ID(s) to notify
 * @param {Object} notificationData.relatedEntity - Related entity info
 * @param {string} notificationData.actionUrl - Optional action URL
 * @param {Object} notificationData.data - Optional additional data
 * @returns {Promise<Array>} Created notifications
 */
export const createNotification = async (notificationData) => {
  try {
    const {
      type,
      title,
      message,
      recipients,
      relatedEntity,
      actionUrl = null,
      data = null
    } = notificationData;

    // Handle both single recipient and array of recipients
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];

    const notifications = await Promise.all(
      recipientArray.map(recipientId =>
        Notification.create({
          recipient: recipientId,
          type,
          title,
          message,
          relatedEntity,
          actionUrl,
          data
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Notifications
 */
export const getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, skip = 0, isRead = null } = options;
    
    let query = { recipient: userId };
    if (isRead !== null) {
      query.isRead = isRead;
    }

    const notifications = await Notification.find(query)
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Notification.countDocuments(query);

    return { notifications, total };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Update result
 */
export const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Deleted notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    return notification;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Notify admins about complaint status
 * @param {Object} complaint - Complaint object
 * @param {string} eventType - Type of event (created, status_updated, assigned)
 * @returns {Promise<Array>} Created notifications
 */
export const notifyAdminsAboutComplaint = async (complaint, eventType) => {
  try {
    // Find all admins and co-admins
    const admins = await User.find({ role: { $in: ['admin', 'co-admin'] } });
    const adminIds = admins.map(admin => admin._id);

    let title, message;

    switch (eventType) {
      case 'created':
        title = `New Complaint: ${complaint.title}`;
        message = `A new complaint has been filed - ${complaint.category} (${complaint.severity})`;
        break;
      case 'status_updated':
        title = `Complaint Status Updated: ${complaint.title}`;
        message = `Complaint status changed to: ${complaint.status}`;
        break;
      case 'assigned':
        title = `Complaint Assigned: ${complaint.title}`;
        message = `A complaint has been assigned to ${complaint.assignedTo?.name || 'a handler'}`;
        break;
      default:
        title = `Complaint Update: ${complaint.title}`;
        message = `There is an update on complaint: ${complaint.title}`;
    }

    const notifications = await createNotification({
      type: `complaint_${eventType}`,
      title,
      message,
      recipients: adminIds,
      relatedEntity: {
        entityType: 'complaint',
        entityId: complaint._id
      },
      actionUrl: `/complaints/${complaint._id}`,
      data: { complaintId: complaint._id, eventType }
    });

    return notifications;
  } catch (error) {
    console.error('Error notifying admins about complaint:', error);
    throw error;
  }
};

/**
 * Notify user about complaint updates
 * @param {string} userId - User ID to notify
 * @param {Object} complaint - Complaint object
 * @param {string} eventType - Type of event
 * @returns {Promise<Array>} Created notifications
 */
export const notifyUserAboutComplaint = async (userId, complaint, eventType) => {
  try {
    let title, message;

    switch (eventType) {
      case 'assigned':
        title = 'Your Complaint Has Been Assigned';
        message = `Your complaint "${complaint.title}" has been assigned to a handler`;
        break;
      case 'status_updated':
        title = 'Your Complaint Status Updated';
        message = `Your complaint "${complaint.title}" status is now: ${complaint.status}`;
        break;
      case 'commented':
        title = 'New Comment on Your Complaint';
        message = `Someone has commented on your complaint: "${complaint.title}"`;
        break;
      default:
        title = 'Complaint Update';
        message = `There is an update on your complaint: "${complaint.title}"`;
    }

    const notifications = await createNotification({
      type: `complaint_${eventType}`,
      title,
      message,
      recipients: userId,
      relatedEntity: {
        entityType: 'complaint',
        entityId: complaint._id
      },
      actionUrl: `/complaints/${complaint._id}`,
      data: { complaintId: complaint._id, eventType }
    });

    return notifications;
  } catch (error) {
    console.error('Error notifying user about complaint:', error);
    throw error;
  }
};

/**
 * Notify all users about new notice
 * @param {Object} notice - Notice object
 * @returns {Promise<Array>} Created notifications
 */
export const notifyAllUsersAboutNotice = async (notice) => {
  try {
    // Get all active users
    const users = await User.find({ isActive: true });
    const userIds = users.map(user => user._id);

    const notifications = await createNotification({
      type: 'notice_created',
      title: `New Notice: ${notice.title}`,
      message: notice.description.substring(0, 100) + '...',
      recipients: userIds,
      relatedEntity: {
        entityType: 'notice',
        entityId: notice._id
      },
      actionUrl: `/notices/${notice._id}`,
      data: { noticeId: notice._id }
    });

    return notifications;
  } catch (error) {
    console.error('Error notifying users about notice:', error);
    throw error;
  }
};
