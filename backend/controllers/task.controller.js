const Task = require('../models/Task');
const logActivity = require('../utils/activityLogger');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;
    const projectId = req.params.projectId;

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority,
      status,
      dueDate: dueDate || null,
    });

    logActivity(projectId, task._id, req.user._id, 'created task', `Created task "${title}"`);

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, assignedTo, priority } = req.query;

    const filter = { projectId };
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, assignedTo, priority, status, dueDate } = req.body;
    const changes = [];

    if (title && title !== task.title) {
      changes.push(`title to "${title}"`);
      task.title = title;
    }
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo || null;
      changes.push('assignee');
    }
    if (priority && priority !== task.priority) {
      changes.push(`priority to ${priority}`);
      task.priority = priority;
    }
    if (status && status !== task.status) {
      changes.push(`status to "${status}"`);
      task.status = status;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
      changes.push('due date');
    }

    await task.save();

    if (changes.length > 0) {
      logActivity(
        task.projectId,
        task._id,
        req.user._id,
        'updated task',
        `Updated ${changes.join(', ')}`
      );
    }

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = req.body.status;
    await task.save();

    logActivity(
      task.projectId,
      task._id,
      req.user._id,
      'updated status',
      `Changed status from "${oldStatus}" to "${task.status}"`
    );

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      projectId: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.project.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
    );

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    logActivity(
      task.projectId,
      null,
      req.user._id,
      'deleted task',
      `Deleted task "${task.title}"`
    );

    await Task.findByIdAndDelete(task._id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
