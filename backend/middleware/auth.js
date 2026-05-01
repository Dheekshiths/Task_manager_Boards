const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

const projectAdmin = (req, res, next) => {
  const project = req.project;
  if (!project) {
    return res.status(500).json({ message: 'Project not loaded' });
  }

  const membership = project.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!membership || membership.role !== 'admin') {
    return res.status(403).json({ message: 'Only project admins can perform this action' });
  }

  next();
};

const projectMember = async (req, res, next) => {
  const Project = require('../models/Project');
  const projectId = req.params.projectId || req.params.id;

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, projectAdmin, projectMember };
