const {
  selectArticles: { selectArticles },
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
