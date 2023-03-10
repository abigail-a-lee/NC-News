const {
  selectCommentsById: { selectCommentsById },
  insertComment: { insertComment },
  selectArticleById: { selectArticleById },
  removeCommentById: { removeCommentById },
} = require("../models");

exports.getCommentsById = (req, res, next) => {
  const id = req.params.article_id;

  // Input validation
  if (isNaN(parseInt(id))) {
    const err = new Error("Bad Request: ID must be a number");
    err.status = 400;
    return next(err);
  }

  selectCommentsById(id)
    .then((comments) => {
      if (comments.length === 0) {
        const err = new Error("No comments found with matching article ID");
        err.status = 404;
        return next(err);
      }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const newComment = req.body;

  // Input validation
  if (isNaN(parseInt(id))) {
    const err = new Error("Bad Request: ID must be a number");
    err.status = 400;
    return next(err);
  }

  if (
    !newComment.body ||
    !newComment.username ||
    !(typeof newComment === "object")
  ) {
    const err = new Error(
      "Bad Request: Missing username/body or request formatted incorrectly"
    );
    err.status = 400;
    return next(err);
  }

  // Check if article exists before performing any comment creation
  selectArticleById(id)
    .then((article) => {
      if (article.length === 0) {
        const err = new Error(
          "Cannot post comment to article that does not exist"
        );
        err.status = 404;
        return next(err);
      } else {
        // After article confirmed to exist, perform creation
        insertComment(id, newComment)
          .then((comment) => {
            res.status(201).send({ comment });
          })
          .catch((err) => {
            err.status = 500;
            return next(err);
          });
      }
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;

  // Input validation
  if (isNaN(parseInt(id))) {
    const err = new Error("Bad Request: ID must be a number");
    err.status = 400;
    return next(err);
  }

  removeCommentById(id)
    .then((comment) => {
      if (comment.length === 0) {
        const err = new Error("Cannot delete comment that does not exist");
        err.status = 404;
        return next(err);
      }
      res.status(204).send();
    })
    .catch((err) => {
      err.status = 500;
      return next(err);
    });
};
