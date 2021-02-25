const loginHandler = (db, bcrypt) => (req, res) => {
  const query = {
    name: req.query.name,
    password: req.query.password
  }

  if (!query.name || !query.password) {
    return res.json({status: 500, message: 'Entries must not be empty!'});
  }

  var queryText = "SELECT * FROM player WHERE player_name = '"
  + query.name + "'";

  // Database SQL query goes here
  db.query(queryText, (err, response) => {
    if (err) {
      res.json({status: 500, message: err});
    } else {
      if (response.rows[0]){
        bcrypt.compare(query.password, response.rows[0].password, function(err, isMatch) {
          if(!isMatch){
            res.json({status: 404, message: 'Passwords do not match'});
          } else {
            res.json({status: 200, message: 'Passwords match'});
            // Send JWT
          }
        });
      }
      else {
        res.json({status: 404, message: 'Player not found.'});
      }
    }
  });
};

module.exports = {
  loginHandler,
};
