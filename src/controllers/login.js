const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

const loginHandler = (db) => (req, res) => {
  const query = {
    name: req.body.name,
    password: req.body.password,
  };

  if (!query.name || !query.password) {
    return res.status(422).json({ message: "Entries must not be empty!" });
  }

  var queryText =
    "SELECT * FROM player WHERE player_name = '" + query.name + "'";

  // Database SQL query goes here
  db.query(queryText, (err, response) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (response.rows[0]) {
        bcrypt.compare(
          query.password,
          response.rows[0].password,
          function (err, isMatch) {
            if (!isMatch) {
              res.status(401).json({ message: "Passwords do not match" });
            } else {
              res.status(200).json({ message: "Passwords match" });
              // Send JWT (the game doesn't need I think)
            }
          }
        );
      } else {
        res.status(401).json({ message: "Player not found." });
      }
    }
  });
};

const loginHandlerWeb = (db) => (req, res) => {
  const query = {
    name: req.body.name,
    password: req.body.password,
  };

  if (!query.name || !query.password) {
    return res.status(422).json({ message: "Entries must not be empty!" });
  }

  var queryText =
    "SELECT * FROM instructor WHERE instructor_name = '" + query.name + "'";

  // Database SQL query goes here
  db.query(queryText, (err, response) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (response.rows[0]) {
        bcrypt.compare(
          query.password,
          response.rows[0].password,
          function (err, isMatch) {
            if (!isMatch) {
              res.status(401).json({ message: "Passwords do not match" });
            } else {
              const payload = {
                sub: query.name,
              };
              // proper implementation will not hardcode secret
              const token = jwt.sign(payload, "supersecretstring");
              res.status(200).json({ message: "Passwords match", jwt: token });
            }
          }
        );
      } else {
        res.status(401).json({ message: "Instructor not found." });
      }
    }
  });
};

module.exports = {
  loginHandler,
  loginHandlerWeb,
};
