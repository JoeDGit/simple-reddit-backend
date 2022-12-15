const db = require('../db/connection');

exports.deleteCommentById = (commentId) => {
  if (!/[0-9]/.test(commentId)) {
    return Promise.reject({
      status: 400,
      msg: 'bad request - invalid comment ID',
    });
  }
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`,
      [commentId]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `404 Error - A comment with ID: ${commentId} does not exist`,
        });
      }
    });
};

exports.checkIfCommentExists = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `404 Error - A comment with ID: ${commentId} does not exist`,
        });
      }
    });
};
