const {
  deleteCommentById,
  checkIfCommentExists,
} = require('../models/models.comments');

exports.removeCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
