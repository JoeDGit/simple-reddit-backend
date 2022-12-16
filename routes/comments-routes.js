const { removeCommentById } = require('../controllers/controllers.comments');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', removeCommentById);

module.exports = commentsRouter;

// app.delete('/api/comments/:comment_id', removeCommentById);
