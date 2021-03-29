const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
/** @module Webapp_Login*/

/**
 * @name loginHandler
 * @description Returns middleware function that authenticates an instructor's credentials and sends success/failure as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [loginHandlerWebMiddleware]{@link module:CreateReadUpdateDelete_Functions~loginHandlerWebMiddleware} - The middleware function
 */
const loginHandlerWeb = (db) =>
  /**
   * @name loginHandlerWebMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res) => {
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
                res
                  .status(200)
                  .json({ message: "Passwords match", jwt: token });
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
  loginHandlerWeb,
};
