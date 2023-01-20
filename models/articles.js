const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (queries) => {
  const findQuery = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.article_id)::integer as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE (articles.topic = %L OR %L IS NULL)
  AND (articles.author = %L OR %L IS NULL)
  GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
  ORDER BY %I %s;
`;

  const formattedQuery = format(
    findQuery,
    queries.topic,
    queries.topic,
    queries.author,
    queries.author,
    queries.sortColumn,
    queries.sortOrder
  );

  return new Promise((resolve, reject) => {
    db.query(formattedQuery)
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
  RETURNING article_id, title, topic, author, created_at, votes, article_img_url;
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
