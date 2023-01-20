const express = require("express");
const app = express();
const {
  getTopics: { getTopics },
  getArticles: { getArticles },
  getArticleById: { getArticleById },
  getCommentsById: { getCommentsById },
  postComment: { postComment },
  patchArticleById: { patchArticleById },
  getUsers: { getUsers },
  deleteCommentById: { deleteCommentById },
} = require("./controllers");

/* const expressOasGenerator = require("express-oas-generator");
expressOasGenerator.init(
  app,
  function (spec) {
    return spec;
  },
  "./swagger_generate.json",
  60 * 1000
); */

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ message: err.message || "Internal Server Error" });
});

module.exports = app;
