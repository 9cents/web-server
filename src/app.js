const express = require("express");
const app = express();

// const { Client } = require("pg");
// const client = new Client();
// client.connect();

app.get("/", (req, res, next) => {
  // console.log("hello world");
  res.send("Hello from backend");
});

module.exports = app;
