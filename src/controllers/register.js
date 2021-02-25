const registerHandler = (db, bcrypt) => (req, res) => {
  const query = {
    name: req.body.name,
    password: req.body.password,
  }

  if (!query.name || !query.password) {
    return res.json({status: 500, message: 'Entries must not be empty!'});
  }
  
  // Hashing the password input
  var salt = bcrypt.genSaltSync(10);
  bcrypt.hash(query.password, salt, null, function(err, hash) {
    var queryText = "INSERT INTO player(player_name, password) "
    + "VALUES('" + query.name + "','" + hash + "')";

    db.query(queryText, (err, response) => {
      if (err) {
        res.json({status: 500, message: err});
      } else {
        res.json({status: 200, message: 'Player added.'});
      }
    });
  });  
};

module.exports = {
  registerHandler,
};
