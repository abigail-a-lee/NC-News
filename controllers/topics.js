const {
  selectTopics: { selectTopics },
} = require("../models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};
