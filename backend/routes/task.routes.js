const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/task.controller');
const {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
} = require('../validators/task.validator');
const validate = require('../middleware/validate');
const { protect, projectMember } = require('../middleware/auth');

router.use(protect, projectMember);

router
  .route('/')
  .get(getTasks)
  .post(createTaskValidator, validate, createTask);

router
  .route('/:taskId')
  .get(getTask)
  .put(updateTaskValidator, validate, updateTask)
  .delete(deleteTask);

router.patch('/:taskId/status', updateStatusValidator, validate, updateTaskStatus);

module.exports = router;
