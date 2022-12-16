const { selectUsers, selectSingleUser } = require('../models/models.users');

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getSingleUser = (req, res, next) => {
  const username = req.params.username;
  selectSingleUser(username)
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};
