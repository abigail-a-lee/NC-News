# **NC News API**

## **Summary**

This repository contains an example of a RESTful API that has been developed using JavaScript and Node.js, with Express.js for routing and PostgreSQL as the database management system. The API was created as part of a one-week solo sprint while I was a student at Northcoders.

The API is designed to provide functionality for managing articles, users, and comments on a news website. It includes a voting system, similar to that found on sites like Reddit, that allows users to upvote or downvote comments and articles. This feature provides a way for users to express their opinions and engage with the content.

While this project was designed for use with a news website, the API's functionality could easily be adapted to other types of projects, such as forums or video hosting sites. This project demonstrates my proficiency in developing a RESTful API using JavaScript, Node.js, Express.js, and PostgreSQL. It showcases my ability to implement a functional and user-friendly system for managing content.

---

## **API endpoints**

Users can query the Postgres database using the following implemented endpoints:

### **`GET /api`**

Serves an endpoint glossary, providing all implemented methods with their available queries, syntax and example responses/inputs.

### **`GET /api/topics`**

Serves an array of all available users, including their username, nickname and avatar_url.

### **`GET /api/topics`**

Serves an array of all available topics, including their descriptions.

### **`GET /api/articles`**

Serves an array of all available articles, by default sorted in descending order by creation date.

Accepts queries for filtering results by the author name and/or topic name, in addition to queries for choosing the sort category and sort order.

### **`GET /api/articles/:article_id`**

Serves the article associated with provided article ID and all relevant article data.

_(also includes the body text from the article, this is not returned by the `GET /api/articles` endpoint to avoid clutter)_

### **`GET /api/articles/:article_id/comments`**

Serves all available comments associated with provided article ID, and all relevant comment data.

### **`POST /api/articles/:article_id/comments`**

Creates a new comment with provided article ID assigned to it, uses JSON object in request body for username and body properties, automatically creates values for remaining properties.

Serves newly created comment.

### **`PATCH /api/articles/:article_id/`**

Allows incrementing/decrementing of the votes property of the article associated with provided article ID, using the value provided by JSON object in request body.

Serves modified article with new votes value.

### **`DELETE /api/comments/:comment_id`**

Deletes the comment and all relevant data associated with the provided comment ID.

For more specific information, please see `endpoints.json` or use the `GET /api` endpoint

---

## **Hosted version**

### **You can try a live production version of this app, hosted with Render, by [clicking here](https://abi-nc-news.onrender.com/api).**

---

## **Setup**

### **Requirements**

- **Node.js**: 19.0.0 or later
- **PostgreSQL**: 12.12 or later

### **Cloning repository**

Using shell, create a directory where you would like to store the project, then change directory to it. _(Optional)_

```bash
$ mkdir project_folder
$ cd project_folder
```

Clone with:

```bash
$ git clone https://github.com/abigail-a-lee/NC-News
```

And finally, ensure you are in the correct directory by running:

```bash
$ cd NC-News
```

### **Installing dependencies**

To install dependencies, simply run the command:

```bash
$ npm install
```

### **Creating Development/Test environment files**

Creation of `.env` files in the project root directory is required to use this project.

The contents must be as follows:

**.env.development:**

```
PGDATABASE=nc_news
```

**.env.test:**

```
PGDATABASE=nc_news_test
```

### **Database creation/seeding**

Run the following script in the root directory to create the development and test databases:

```bash
$ npm run setup-dbs
```

Then run:

```bash
$ npm run seed
```

To seed the databases with data.

### **Tests**

You can test that everything has been setup and is working correctly by using the command

```bash
$ npm test
```

---

## **Dependencies**

This project requires the following Node.JS packages:

### **Production dependencies**

| **Package** | **Version** | **Usage**                                             |
| ----------- | ----------- | ----------------------------------------------------- |
| dotenv      | ^16.0.0     | _Handles environment variable files_                  |
| express     | ^4.18.2     | _Routes API requests_                                 |
| pg          | ^8.7.3      | _Queries postgreSQL database_                         |
| pg-format   | ^1.0.4      | _Formats postgreSQL queries to prevent SQL injection_ |

### **Developer dependencies**

| **Package**   | **Version** | **Usage**                                             |
| ------------- | ----------- | ----------------------------------------------------- |
| husky         | ^8.0.2      | _Validates commit by running tests before committing_ |
| jest          | ^27.5.1     | _Provides framework for testing functionality_        |
| jest-extended | ^2.0.0      | _Adds additional jest testing identifiers_            |
| jest-sorted   | ^1.0.14     | _Adds sort testing for jest_                          |
| supertest     | ^6.3.3      | _Adds simplified web request testing_                 |
