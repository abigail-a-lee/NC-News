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

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = app;
