const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id
// @access  Private
const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification && notification.userId.toString() === req.user._id.toString()) {
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } else {
    res.status(404).json({ message: 'Notification not found' });
  }
};

module.exports = { getNotifications, markAsRead };
