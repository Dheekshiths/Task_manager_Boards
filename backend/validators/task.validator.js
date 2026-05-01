const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('assignedTo').optional({ values: 'null' }).isMongoId().withMessage('Invalid user ID'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Done'])
    .withMessage('Invalid status'),
  body('dueDate').optional({ values: 'null' }).isISO8601().withMessage('Invalid date format'),
];

const updateTaskValidator = [
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('assignedTo').optional({ values: 'null' }).isMongoId(),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('status').optional().isIn(['Todo', 'In Progress', 'Done']),
  body('dueDate').optional({ values: 'null' }).isISO8601(),
];

const updateStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Todo', 'In Progress', 'Done'])
    .withMessage('Invalid status'),
];

module.exports = { createTaskValidator, updateTaskValidator, updateStatusValidator };
