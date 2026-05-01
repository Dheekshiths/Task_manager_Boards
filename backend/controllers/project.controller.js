const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const logActivity = require('../utils/activityLogger');

exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    logActivity(project._id, null, req.user._id, 'created project', `Created project "${name}"`);

    const populated = await Project.findById(project._id).populate('members.user', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email')
      .sort({ updatedAt: -1 });

    // Attach task counts
    const projectIds = projects.map((p) => p._id);
    const taskCounts = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', total: { $sum: 1 } } },
    ]);

    const countMap = {};
    taskCounts.forEach((t) => (countMap[t._id.toString()] = t.total));

    const result = projects.map((p) => ({
      ...p.toObject(),
      taskCount: countMap[p._id.toString()] || 0,
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'members.user',
      'name email'
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = req.project;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    logActivity(project._id, null, req.user._id, 'updated project', `Updated project details`);

    const populated = await Project.findById(project._id).populate('members.user', 'name email');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = req.project;

    await Task.deleteMany({ projectId: project._id });
    await Activity.deleteMany({ projectId: project._id });
    await Project.findByIdAndDelete(project._id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const project = req.project;

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userId
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({ user: userId, role: role || 'member' });
    await project.save();

    logActivity(project._id, null, req.user._id, 'added member', `Added a new member to the project`);

    const populated = await Project.findById(project._id).populate('members.user', 'name email');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const project = req.project;
    const { userId } = req.params;

    if (userId === project.createdBy.toString()) {
      return res.status(400).json({ message: 'Cannot remove the project creator' });
    }

    const memberIndex = project.members.findIndex(
      (m) => m.user.toString() === userId
    );
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'User is not a member' });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    // Unassign tasks from the removed member
    await Task.updateMany(
      { projectId: project._id, assignedTo: userId },
      { assignedTo: null }
    );

    logActivity(project._id, null, req.user._id, 'removed member', `Removed a member from the project`);

    const populated = await Project.findById(project._id).populate('members.user', 'name email');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};
