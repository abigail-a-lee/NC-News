const {
  selectUsers: { selectUsers },
} = require("../models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};
