const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const pool = require("./database/db").getInstance();

const login = require("./controllers/login");
const register = require("./controllers/register");

var resourcesRouter = require("./resources/resourcesRouter");

// Set up Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.get("/login", login.loginHandler(pool, bcrypt));
app.post("/register", register.registerHandler(pool, bcrypt));
app.get("/loginweb", login.loginHandlerWeb(pool, bcrypt));
app.post("/registerweb", register.registerHandlerWeb(pool, bcrypt));

app.use("/", resourcesRouter);

module.exports = app;
