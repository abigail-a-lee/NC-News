const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `
  SELECT articles.author, articles.title, articles.article_id,  articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT (comments.article_id)::integer as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
`
    )
    .then((result) => {
      return result.rows;
    });
};
