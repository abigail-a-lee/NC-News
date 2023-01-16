const express = require("express");
const app = express();

const {
  getTopics: { getTopics },
} = require("./controllers");

app.get("/api/topics", getTopics);

module.exports = app;
