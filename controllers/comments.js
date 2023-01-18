const {
  selectCommentsById: { selectCommentsById },
} = require("../models");

exports.getCommentsById = (req, res, next) => {
  const id = req.params.article_id;
  selectCommentsById(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
