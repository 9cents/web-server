const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const conf = require('./database/db.config')

const login = require('./controllers/login');
const register = require('./controllers/register');

// Set up Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// PostgreSQL connection set up
const { Pool } = require("pg");
const pool = new Pool({
  user: conf.USER,
  host: conf.HOST,
  database: conf.DB,
  password: conf.PASSWORD,
  port: 5432
});

app.get("/", (req, res, next) => {
  // console.log("hello world");
  res.send("Hello from backend");
});

app.get("/test", (req, res, next) => {
  // console.log("hello world");
  res.send("Test is working");
});

// Login route for instructor.
// First arg is database reference, second is bcrypt to hash password
app.post('/login', login.loginHandler(pool, bcrypt))
app.post('/register', register.registerHandler(pool, bcrypt))

module.exports = app;
