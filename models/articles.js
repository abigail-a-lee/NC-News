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

  return new Promise((resolve, reject) => {
    db.query(findQuery)
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
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
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.updateArticleById = (id, votes) => {
  const updateQuery = `
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *;
  `;

  return new Promise((resolve, reject) => {
    db.query(updateQuery, [id, votes])
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
