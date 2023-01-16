const express = require("express");
const app = express();
app.use(express.json());

const {
  getTopics: { getTopics },
} = require("./controllers");

app.get("/api/topics", getTopics);

module.exports = app;
