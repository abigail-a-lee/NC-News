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
  if (!/^\d+$/.test(id)) {
    return Promise.reject({
      status: 400,
      message: "Bad Request: ID must be a number",
    });
  }

  const findQuery = `
  SELECT *
  FROM articles
`;
  const filterQuery = ` WHERE article_id = $1;`;

  return db.query(findQuery + filterQuery, [id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        message: "Article not found",
      });
    }
    return result.rows;
  });
};
