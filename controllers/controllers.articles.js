const {
  selectArticles,
  selectArticleById,
  selectArticleComments,
  checkIfArticleExists,
  insertArticle,
  insertArticleComment,
  updateArticleVotes,
} = require('../models/models.articles');
exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const articleId = req.params.article_id;

  Promise.all([
    selectArticleComments(articleId),
    checkIfArticleExists(articleId),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const userComment = req.body;

  insertArticleComment(articleId, userComment)
    .then(({ commentId, commentBody }) => {
      res.status(201).send({ commentId, commentBody });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const voteChange = req.body;
  Promise.all([
    updateArticleVotes(articleId, voteChange),
    checkIfArticleExists(articleId),
  ])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then((article) => {
      article.comment_count = 0;
      res.status(200).send({ article });
    })
    .catch(next);
};
