const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticle,
  postArticleComment,
  patchArticleVotes,
  deleteArticleById,
  patchArticleBodyById,
} = require('../controllers/controllers.articles');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getArticleComments)
  .post(postArticleComment);

articlesRouter.route('/:article_id/body').patch(patchArticleBodyById);

module.exports = articlesRouter;
