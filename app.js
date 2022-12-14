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
const { getUsers } = require("./controllers/controllers.users");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getUsers);

app.all("*", handleBadPaths);
app.use(handleBadRequests);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
