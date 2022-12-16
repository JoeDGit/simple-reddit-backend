const { getUsers } = require('../controllers/controllers.users');

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers);

module.exports = usersRouter;
