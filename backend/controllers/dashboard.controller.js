const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

exports.getDashboard = async (req, res, next) => {
  try {
    // Get all projects user is a member of
    const projects = await Project.find({ 'members.user': req.user._id }).select('_id name');
    const projectIds = projects.map((p) => p._id);

    // Task stats
    const [totalTasks, completedTasks, overdueTasks, tasksByStatus, myTasks] =
      await Promise.all([
        Task.countDocuments({ projectId: { $in: projectIds } }),
        Task.countDocuments({ projectId: { $in: projectIds }, status: 'Done' }),
        Task.countDocuments({
          projectId: { $in: projectIds },
          status: { $ne: 'Done' },
          dueDate: { $lt: new Date(), $ne: null },
        }),
        Task.aggregate([
          { $match: { projectId: { $in: projectIds } } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Task.find({ assignedTo: req.user._id, status: { $ne: 'Done' } })
          .populate('projectId', 'name')
          .sort({ dueDate: 1 })
          .limit(10),
      ]);

    // Format tasks by status
    const statusCounts = { Todo: 0, 'In Progress': 0, Done: 0 };
    tasksByStatus.forEach((s) => (statusCounts[s._id] = s.count));

    // Recent activity
    const recentActivity = await Activity.find({ projectId: { $in: projectIds } })
      .populate('userId', 'name email')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      stats: {
        totalTasks,
        completedTasks,
        overdueTasks,
        inProgressTasks: statusCounts['In Progress'],
        todoTasks: statusCounts['Todo'],
      },
      tasksByStatus: statusCounts,
      myTasks,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};
