const express = require("express");
const app = express();

const {
  getTopics: { getTopics },
  getArticles: { getArticles },
  getArticleById: { getArticleById },
} = require("./controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

module.exports = app;
