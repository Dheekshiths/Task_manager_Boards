const Activity = require('../models/Activity');

const logActivity = (projectId, taskId, userId, action, details = '') => {
  Activity.create({ projectId, taskId, userId, action, details }).catch((err) =>
    console.error('Activity log error:', err.message)
  );
};

module.exports = logActivity;
