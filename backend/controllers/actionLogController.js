const ActionLog = require('../models/ActionLog');

// @desc    Get all action logs
// @route   GET /api/logs
// @access  Private (Admin only)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await ActionLog.find().populate('userId', 'name email');

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Create a new action log (called whenever an action is performed)
exports.createLog = async (userId, action) => {
  try {
    const newLog = new ActionLog({ userId, action });

    await newLog.save();
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
