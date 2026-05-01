const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/project.controller');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
} = require('../validators/project.validator');
const validate = require('../middleware/validate');
const { protect, projectMember, projectAdmin } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getProjects).post(createProjectValidator, validate, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(projectMember, projectAdmin, updateProjectValidator, validate, updateProject)
  .delete(projectMember, projectAdmin, deleteProject);

router
  .route('/:id/members')
  .post(projectMember, projectAdmin, addMemberValidator, validate, addMember);

router
  .route('/:id/members/:userId')
  .delete(projectMember, projectAdmin, removeMember);

module.exports = router;
