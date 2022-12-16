const { getTopics } = require('../controllers/controllers.topics');
const topicsRouter = require('express').Router();

topicsRouter.get('/', getTopics);

module.exports = topicsRouter;
