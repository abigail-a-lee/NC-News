const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = (queries) => {
  const findQuery = `
  SELECT articles.*
  COUNT(comments.article_id)::integer as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE (articles.topic = %L OR %L IS NULL)
  AND (articles.author = %L OR %L IS NULL)
  GROUP BY articles.*
  ORDER BY %I %s;
  LIMIT 10
  OFFSET (%I - 1) * 5;
`;

  const formattedQuery = format(
    findQuery,
    queries.topic,
    queries.topic,
    queries.author,
    queries.author,
    queries.sortColumn,
    queries.sortOrder,
    queries.page
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
  SELECT articles.*,
  COUNT(comments.article_id)::integer as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
`;
  const filterQuery = ` WHERE articles.article_id = $1`;

  const groupQuery = ` GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.body, articles.votes, articles.article_img_url;`;

  return new Promise((resolve, reject) => {
    db.query(findQuery + filterQuery + groupQuery, [id])
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
