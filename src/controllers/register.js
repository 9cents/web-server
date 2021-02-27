const bcrypt = require("bcrypt-nodejs");

const registerHandler = (db) => (req, res) => {
  const query = {
    name: req.body.name,
    password: req.body.password,
  };

  if (!query.name || !query.password) {
    return res.status(422).json({ message: "Entries must not be empty!" });
  }

  // Hashing the password input
  var salt = bcrypt.genSaltSync(10);
  bcrypt.hash(query.password, salt, null, function (err, hash) {
    var queryText =
      "INSERT INTO player(player_name, password) " +
      "VALUES('" +
      query.name +
      "','" +
      hash +
      "')";

    db.query(queryText, (err, response) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ message: "Player added." });
      }
    });
  });
};

const registerHandlerWeb = (db) => (req, res) => {
  const query = {
    name: req.body.name,
    password: req.body.password,
  };

  if (!query.name || !query.password) {
    return res.status(422).json({ message: "Entries must not be empty!" });
  }

  // Hashing the password input
  var salt = bcrypt.genSaltSync(10);
  bcrypt.hash(query.password, salt, null, function (err, hash) {
    var queryText =
      "INSERT INTO instructor(instructor_name, password) " +
      "VALUES('" +
      query.name +
      "','" +
      hash +
      "')";

    console.log(queryText);

    db.query(queryText, (err, response) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ message: "Instructor added." });
      }
    });
  });
};

module.exports = {
  registerHandler,
  registerHandlerWeb,
};
