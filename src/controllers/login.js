const loginHandler = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("unsuccessful");
  }

  // Database SQL query goes here
  db.query("SELECT", (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res.rows[0]);
    }
  });
};

module.exports = {
  loginHandler,
};
