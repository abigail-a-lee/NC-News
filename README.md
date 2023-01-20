# **NC News API**

## **Summary**

This repository contains an example of a RESTful API that has been developed using JavaScript and Node.js, with Express.js for routing and PostgreSQL as the database management system. The API was created as part of a one-week solo sprint while I was a student at Northcoders.

The API is designed to provide functionality for managing articles, users, and comments on a news website. It includes a voting system, similar to that found on sites like Reddit, that allows users to upvote or downvote comments and articles. This feature provides a way for users to express their opinions and engage with the content.

While this project was designed for use with a news website, the API's functionality could easily be adapted to other types of projects, such as forums or video hosting sites. This project demonstrates my proficiency in developing a RESTful API using JavaScript, Node.js, Express.js, and PostgreSQL. It showcases my ability to implement a functional and user-friendly system for managing content.

---

## **API endpoints**

Users can query the Postgres database using the following implemented endpoints:

### **` GET /api`**

Serves an endpoint glossary, providing all implemented methods with their available queries, syntax and example responses/inputs.

### **` GET /api/topics`**

Serves an array of all available users, including their username, nickname and avatar_url.

### **` GET /api/topics`**

Serves an array of all available topics, including their descriptions.

### **` GET /api/articles`**

Serves an array of all available articles, by default sorted in descending order by creation date.

Accepts queries for filtering results by the author name and/or topic name, in addition to queries for choosing the sort category and sort order.

### **` GET /api/articles/:article_id`**

Serves the article associated with provided article ID and all relevant article data.

_(also includes the body text from the article, this is not returned by the `GET /api/articles` endpoint to avoid clutter)_

### **` GET /api/articles/:article_id/comments`**

Serves all available comments associated with provided article ID, and all relevant comment data.

### **` POST /api/articles/:article_id/comments`**

Creates a new comment with provided article ID assigned to it, uses JSON object in request body for username and body properties, automatically creates values for remaining properties.

Serves newly created comment.

### **` PATCH /api/articles/:article_id/`**

Allows incrementing/decrementing of the votes property of the article associated with provided article ID, using the value provided by JSON object in request body.

Serves modified article with new votes value.

### **` DELETE /api/comments/:comment_id`**

Deletes the comment and all relevant data associated with the provided comment ID.

For more specific information, please see `endpoints.json` or use the `GET /api` endpoint

---

## **Setup instructions**

### **1.** Create environment variable files `.env.test` and `.env.development` in the root directory with the following information:

**.env.development:**

```
PGDATABASE=nc_news
```

**.env.test:**

```
PGDATABASE=nc_news_test
```

---

## **Hosted version**

Live production version of this app is available here:

https://abi-nc-news.onrender.com/api
