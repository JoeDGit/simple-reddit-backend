const {
  removeCommentById,
  patchCommentsVotes,
} = require('../controllers/controllers.comments');

const commentsRouter = require('express').Router();

commentsRouter
  .route('/:comment_id')
  .delete(removeCommentById)
  .patch(patchCommentsVotes);

module.exports = commentsRouter;
