const { deleteCommentById } = require('../models/models.comments');

exports.removeCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
