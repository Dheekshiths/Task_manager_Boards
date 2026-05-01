const Comment = require('../models/Comment');
const logActivity = require('../utils/activityLogger');
const Task = require('../models/Task');

exports.addComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      taskId,
      userId: req.user._id,
      text,
    });

    logActivity(
      task.projectId,
      task._id,
      req.user._id,
      'commented',
      `Added a comment on "${task.title}"`
    );

    const populated = await Comment.findById(comment._id).populate('userId', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await Comment.findByIdAndDelete(comment._id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
