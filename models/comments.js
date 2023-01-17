const db = require("../db/connection");

exports.selectCommentsById = (id) => {
  const findQuery = `SELECT * FROM comments `;
  const filterQuery = `WHERE article_id = $1 `;
  const sortQuery = `ORDER BY created_at DESC;`;

  return new Promise((resolve, reject) => {
    db.query(findQuery + filterQuery + sortQuery, [id])
      .then((result) => {
        if (result.rowCount === 0) {
          const error = new Error("No comments found with matching article ID");
          error.status = 404;
          reject(error);
        }
        resolve(result.rows);
      })
      .catch((err) => {
        err.message = "Bad Request: ID must be a number";
        err.status = 400;
        reject(err);
      });
  });
};
