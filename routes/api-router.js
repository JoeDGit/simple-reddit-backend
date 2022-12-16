const apiRouter = require('express').Router();
const { getEndpointInfo } = require('../controllers/controllers.api');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-routes');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-routes');

apiRouter.get('/', getEndpointInfo);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
