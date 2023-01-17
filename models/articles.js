const db = require("../db/connection");

exports.selectArticles = () => {
  const findQuery = `
  SELECT articles.author, articles.title, articles.article_id,  articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT (comments.article_id)::integer as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
`;

  return db.query(findQuery).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (id) => {
  const findQuery = `
  SELECT *
  FROM articles
`;
  const filterQuery = ` WHERE article_id = $1;`;
  return new Promise((resolve, reject) => {
    db.query(findQuery + filterQuery, [id])
      .then((result) => {
        if (result.rowCount === 0) {
          const error = new Error("Article not found");
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
