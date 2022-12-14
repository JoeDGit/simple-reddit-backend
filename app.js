const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers.topics");
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
} = require("./controllers/controllers.articles");
const {
  handleBadPaths,
  handleServerErrors,
  handleCustomErrors,
  handleBadRequests,
} = require("./controllers/controllers.errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.use(handleBadRequests);
app.use(handleCustomErrors);
app.all("*", handleBadPaths);
app.use(handleServerErrors);

module.exports = app;
