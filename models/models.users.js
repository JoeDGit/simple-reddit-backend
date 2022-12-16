const db = require('../db/connection');

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.selectSingleUser = (username) => {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE username ILIKE $1`,
      [username]
    )
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `User with username: ${username} does not exist`,
        });
      }
      return user.rows[0];
    });
};
