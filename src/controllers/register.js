const bcrypt = require("bcrypt-nodejs");
/** @module Webbapp_Registration*/
/**
 * @name registerHandler
 * @description Returns middleware function that registers a new instructor sends success/failure as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} - The middleware function
 */
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

    //console.log(queryText);

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
  registerHandlerWeb,
};
