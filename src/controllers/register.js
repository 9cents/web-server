const registerHandler = (db, bcrypt) => (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("unsuccessful");
  }
  const hash = bcrypt.hashSync(password);

  // SQL Query goes here
  db.query("SELECT", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows[0]);
    }
  });
};

module.exports = {
  registerHandler,
};
