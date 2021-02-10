require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 3000;

const app = require("./app");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
