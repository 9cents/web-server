// GET /resource
getFunc = (db, resource) => (req, res, next) => {
  const query = req.query;

  var queryText = `SELECT * FROM public.${resource.name} `;

  // if user passed in query
  if (JSON.stringify(query) !== JSON.stringify({})) {
    queryText += "WHERE ";
    // check if there are conditions to form WHERE clause
    fieldPresent = false;
    const allFields = [...resource.fields, resource.primaryKey];
    allFields.forEach((val) => {
      if (query.hasOwnProperty(val)) {
        queryText += `${val}=`;
        queryText += `'${query[val]}', `;
        fieldPresent = true;
      }
    });
    if (!fieldPresent) {
      res.status(422).json({message: 'No conditions found.'});
      return;
    }
    queryText = queryText.slice(0, -2); // remove extra comma and space
  }

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({message: err});
    } else {
      res.status(200).json({message: 'Rows returned.', data : response.rows})
    }
  });
};

// to insert one, used with PUT
insertOne = (db, resource) => (req, res, next) => {
  const valuesObject = { ...req.body };

  // check if every column is found in req
  try {
    valuesList = resource.fields.map((val) => {
      if (valuesObject.hasOwnProperty(val)) {
        return valuesObject[val];
      } else {
        res.status(422).send(`Value for column ${val} not found.`);
        throw `Value for column ${val} not found.`;
      }
    });
  } catch (err) {
    return;
  }

  const queryText =
    "INSERT INTO " +
    `public.${resource.name}(${resource.fields.toString()})` +
    ` VALUES(${resource.fields.map((val, idx) => `$${idx + 1}`).toString()})`;

  db.query(queryText, valuesList, (err, response) => {
    if (err) {
      console.error("Error inserting new row:", err.detail);
      res.status(500).json({message: err});
    } else {
      res.status(200).json({message: 'Row inserted.', data : response.rows})
    }
  });
};

// to update one, used with PUT
updateOne = (db, resource) => (req, res, next) => {
  const valuesObject = { ...req.body };
  const conditions = valuesObject.conditions;
  delete valuesObject[conditions];

  // queryText to form SQL query
  var queryText = "UPDATE " + `public.${resource.name} ` + "SET ";

  // check if there are values to form SET clause
  var fieldPresent = false;
  resource.fields.forEach((val) => {
    if (valuesObject.hasOwnProperty(val)) {
      queryText += `${val}=`;
      queryText += `'${valuesObject[val]}', `;
      fieldPresent = true;
    }
  });
  if (!fieldPresent) {
    res.status(422).json({message: `No values to set.`});
    return;
  }

  queryText = queryText.slice(0, -2) + " WHERE "; // remove extra comma and space

  // check if there are conditions to form WHERE clause
  fieldPresent = false;
  const allFields = [...resource.fields, resource.primaryKey];
  allFields.forEach((val) => {
    if (conditions.hasOwnProperty(val)) {
      queryText += `${val}=`;
      queryText += `'${conditions[val]}', `;
      fieldPresent = true;
    }
  });
  if (!fieldPresent) {
    res.status(422).json({message: `No conditions found.`});
    return;
  }

  queryText = queryText.slice(0, -2); // remove extra comma and space

  db.query(queryText, (err, response) => {
    if (err) {
      console.error("Error updating row:", err.detail);
      res.status(500).json({message: err});
      return;
    }
    res.status(200).json({message: 'Row(s) updated.', data : response.rows})
  });
};

// PUT /resource
putFunc = (db, resource) => (req, res, next) => {
  if (req.body.conditions) {
    updateOne(db, resource)(req, res, next);
  } else {
    insertOne(db, resource)(req, res, next);
  }
};

// DELETE /resource
deleteFunc = (db, resource) => (req, res, next) => {
  const valuesObject = req.body;

  var queryText = "DELETE FROM " + `public.${resource.name} ` + "WHERE ";
  // check if there are values to form WHERE clause
  var fieldPresent = false;
  const allFields = [...resource.fields, resource.primaryKey];
  allFields.forEach((val) => {
    if (valuesObject.hasOwnProperty(val)) {
      queryText += `${val}=`;
      queryText += `'${valuesObject[val]}', `;
      fieldPresent = true;
    }
  });
  if (!fieldPresent) {
    res.status(422).json({message: `No conditions found.`});
    return;
  }

  queryText = queryText.slice(0, -2); // remove extra comma and space

  db.query(queryText, (err, response) => {
    if (err) {
      console.error("Error updating row:", err.detail);
      res.status(500).json({message: err});
      return;
    }
    res.status(200).json({message: 'Row(s) deleted.', data : response.rows});
  });
};

module.exports = {
  getFunc,
  putFunc,
  deleteFunc,
};
