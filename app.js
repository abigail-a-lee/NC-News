const express = require("express");
const app = express();
const {
  getTopics: { getTopics },
  getArticles: { getArticles },
  getArticleById: { getArticleById },
  getCommentsById: { getCommentsById },
  postComment: { postComment },
} = require("./controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ message: err.message || "Internal Server Error" });
});

module.exports = app;
