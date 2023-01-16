const express = require("express");
const app = express();

const {
  getTopics: { getTopics },
  getArticles: { getArticles },
} = require("./controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;
