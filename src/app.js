const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const login = require('./controllers/login');
const register = require('./controllers/register');

// Set up Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// PostgreSQL connection set up
const { Pool } = require("pg");
const pool = new Pool();

app.get("/", (req, res, next) => {
  // console.log("hello world");
  res.send("Hello from backend");
});

// Login route for intructor.
// First arg is database reference, second is bcrypt to hash password
app.post('/login', login.loginHandler(pool, bcrypt))
app.post('/register', register.registerHandler(pool, bcrypt))

module.exports = app;
