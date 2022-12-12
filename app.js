const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers.topics");
const { getArticles } = require("./controllers/controllers.articles");
const {
  handleBadPaths,
  handleServerErrors,
} = require("./controllers/controllers.errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(handleServerErrors);
app.all("*", handleBadPaths);

module.exports = app;
