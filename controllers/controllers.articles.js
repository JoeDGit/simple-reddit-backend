const {
  selectArticles,
  selectArticleById,
  selectArticleComments,
  checkIfArticleExists,
  insertArticleComment,
} = require("../models/models.articles");
exports.getArticles = (req, res, next) => {
  selectArticles()
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
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
