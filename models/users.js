const db = require("../db/connection");

exports.selectUsers = () => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM users;`)
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
