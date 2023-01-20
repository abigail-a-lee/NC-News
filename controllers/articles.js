const {
  selectArticles: { selectArticles },
  selectArticleById: { selectArticleById },
  updateArticleById: { updateArticleById },
} = require("../models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  // Input validation
  if (isNaN(parseInt(id))) {
    const err = new Error("Bad Request: ID must be a number");
    err.status = 400;
    return next(err);
  }

  selectArticleById(id)
    .then((article) => {
      if (article.length === 0) {
        const err = new Error("Article not found");
        err.status = 404;
        return next(err);
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  const newVote = req.body;

  // Input validation
  if (isNaN(parseInt(id))) {
    const err = new Error("Bad Request: ID must be a number");
    err.status = 400;
    return next(err);
  }

  if (
    !newVote.inc_votes ||
    !(typeof newVote === "object") ||
    parseInt(newVote.inc_votes) === NaN
  ) {
    const err = new Error(
      "Bad Request: Missing vote increment amount or request formatted incorrectly"
    );
    err.status = 400;
    return next(err);
  }

  // Check if article exists before performing any article editing
  selectArticleById(id)
    .then((article) => {
      if (article.length === 0) {
        const err = new Error(
          "Cannot edit votes of article that does not exist"
        );
        err.status = 404;
        return next(err);
      } else {
        // After article confirmed to exist, perform editing
        updateArticleById(id, newVote.inc_votes)
          .then((article) => {
            res.status(200).send({ article });
          })
          .catch((err) => {
            err.status = 500;
            return next(err);
          });
      }
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};
