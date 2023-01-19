const {
  selectArticles: { selectArticles },
  selectArticleById: { selectArticleById },
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
