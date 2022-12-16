const { getUsers, getSingleUser } = require('../controllers/controllers.users');

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getSingleUser);

module.exports = usersRouter;
