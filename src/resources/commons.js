getAll = (db, resource) => (req, res, next) => {
  db.query(`SELECT * FROM ${resource.name};`, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).send(err.detail);
    } else {
      res.send(response);
    }
  });
};

insertOne = (db, resource) => (req, res, next) => {
  const valuesObject = { ...req.body };
  valuesList = resource.fields.map((val) => {
    if (valuesObject.hasOwnProperty(val)) {
      return valuesObject[val];
    } else {
      res.status(422).send(`Value for column ${val} not found.`);
    }
  });

  const queryText =
    "INSERT INTO " +
    `${resource.name}(${resource.fields.toString()})` +
    `VALUES(${resource.fields.map((val, idx) => `$${idx + 1}`).toString()})`;

  db.query(queryText, valuesList, (err, response) => {
    if (err) {
      console.error("Error inserting new row:", err.detail);
      res.status(500).send(err);
    } else {
      res.send("Done");
    }
  });
};

updateOne = (db, resource) => (req, res, next) => {
  var queryText = "UPDATE " + `${resource.name} ` + "SET ";
  const valuesObject = { ...req.body };
  const conditions = valuesObject.conditions;
  delete valuesObject[conditions];

  resource.fields.forEach((val) => {
    if (valuesObject.hasOwnProperty(val)) {
      queryText += `${val}=`;
      queryText += `"${valuesObject[val]}", `;
    }
  });
  queryText = queryText.slice(0, -2) + " WHERE ";

  resource.fields.forEach((val) => {
    if (conditions.hasOwnProperty(val)) {
      queryText += `${val}=`;
      queryText += `"${conditions[val]}", `;
    }
  });

  queryText = queryText.slice(0, -2);

  console.log(queryText);
  db.query(queryText, (err, response) => {
    if (err) {
      console.error("Error updating row:", err.detail);
      res.status(500).send(err);
    } else {
      res.send("Updated row.");
    }
  });
};

deleteOne = (db, resource) => (req, res, next) => {
  const valuesObject = req.body;

  const queryText = "DELETE FROM " + `${resource.name} ` + "WHERE " + ``;
};

module.exports = {
  getAll,
  insertOne,
  updateOne,
};
