const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const login = require('./controllers/login');
const register = require('./controllers/register');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const { Client } = require("pg");
// const client = new Client();
// client.connect();

app.get("/", (req, res, next) => {
  // console.log("hello world");
  res.send("Hello from backend");
});

// Login route for intructor.
// First arg is database reference, second is bcrypt to hash password
app.post('/login', login.loginHandler(db, bcrypt))
app.post('/register', register.registerHandler(db, bcrypt))

module.exports = app;
