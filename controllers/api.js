exports.getEndpoints = (req, res, next) => {
  const endpoints = require("../endpoints.json");
  return res
    .status(200)
    .send({ endpoints })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};
