const {
  selectArticles: { selectArticles },
  selectArticleById: { selectArticleById },
  updateArticleById: { updateArticleById },
} = require("../models");

exports.getArticles = (req, res, next) => {
  // Initialising queries from user input or default if not provided input
  const queries = {};
  queries.sortColumn = req.query.sort_by ? req.query.sort_by : "created_at";
  queries.sortOrder = req.query.order ? req.query.order : "DESC";
  queries.page = req.query.p ? req.query.p : "1";
  queries.topic = req.query.topic;
  queries.author = req.query.author;

  // Input validation on queries
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ].includes(queries.sortColumn)
  ) {
    const err = new Error("Invalid sort category");
    err.status = 400;
    return next(err);
  }

  if (parseInt(queries.page) === NaN) {
    const err = new Error("Page must be a number");
    err.status = 400;
    return next(err);
  }

  if (!["ASC", "DESC"].includes(queries.sortOrder.toUpperCase())) {
    const err = new Error("Invalid sort order (must be 'asc' or 'desc')");
    err.status = 400;
    return next(err);
  }
  if (typeof queries.topic !== "string") queries.topic = null;
  if (typeof queries.author !== "string") queries.author = null;

  selectArticles(queries)
    .then((articles) => {
      res.status(200).send({ articles });
      return next();
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
      return next();
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
            return next();
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
