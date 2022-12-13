const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers.topics");
const {
  getArticles,
  getArticleById,
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

app.all("*", handleBadPaths);
app.use(handleBadRequests);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
