const { body } = require('express-validator');

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

const updateProjectValidator = [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
];

const addMemberValidator = [
  body('userId').notEmpty().withMessage('User ID is required').isMongoId(),
  body('role')
    .optional()
    .isIn(['admin', 'member'])
    .withMessage('Role must be admin or member'),
];

module.exports = { createProjectValidator, updateProjectValidator, addMemberValidator };
