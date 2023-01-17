const {
  selectArticles: { selectArticles },
  selectArticleById: { selectArticleById },
} = require("../models");

exports.getArticles = (req, res) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};

exports.getArticleById = (req, res) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status || 500).send({ message: err.message });
    });
};
