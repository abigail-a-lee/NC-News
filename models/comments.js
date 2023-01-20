const db = require("../db/connection");

exports.selectCommentsById = (id) => {
  const findQuery = `SELECT * FROM comments `;
  const filterQuery = `WHERE article_id = $1 `;
  const sortQuery = `ORDER BY created_at DESC;`;

  return new Promise((resolve, reject) => {
    db.query(findQuery + filterQuery + sortQuery, [id])
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.insertComment = (id, newComment) => {
  const insertQuery = `
  INSERT INTO comments 
  (body, votes, author, article_id, created_at) 
  VALUES ($1, 0, $2, $3, $4) 
  RETURNING *;
  `;

  // Creates timestamp from current time when function is executed
  const timestamp = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.query(insertQuery, [newComment.body, newComment.username, id, timestamp])
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.removeCommentById = (id) => {
  const deleteQuery = `
  DELETE FROM comments 
  WHERE comment_id = $1
  RETURNING *
  `;

  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [id])
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        console.log("database error");
        reject(err);
      });
  });
};
