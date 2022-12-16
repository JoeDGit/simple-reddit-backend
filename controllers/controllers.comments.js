const {
  deleteCommentById,
  updateCommentVotes,
  checkIfCommentExists,
} = require('../models/models.comments');

exports.removeCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchCommentsVotes = (req, res, next) => {
  const voteChange = req.body.inc_votes;
  const commentId = req.params.comment_id;
  Promise.all([
    updateCommentVotes(commentId, voteChange),
    checkIfCommentExists(commentId),
  ])
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
