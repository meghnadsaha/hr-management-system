const { createLog } = require('../controllers/actionLogController');

// Middleware to log user actions
const logAction = (action) => {
  return async (req, res, next) => {
    await createLog(req.user.id, action);
    next();
  };
};

module.exports = logAction;
