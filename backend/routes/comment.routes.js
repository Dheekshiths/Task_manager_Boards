const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment } = require('../controllers/comment.controller');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.use(protect);

router
  .route('/:taskId/comments')
  .get(getComments)
  .post(
    [body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 })],
    validate,
    addComment
  );

router.delete('/:taskId/comments/:commentId', deleteComment);

module.exports = router;
