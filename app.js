const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers.topics");
const {
  handleBadPaths,
  handleServerErrors,
} = require("./controllers/controllers.errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use(handleServerErrors);
app.all("*", handleBadPaths);

module.exports = app;
