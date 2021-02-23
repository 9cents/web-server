// GET /resource
getFunc = (db, resource) => (req, res, next) => {
  const query = req.query;

  var queryText = `SELECT * FROM ${resource.name} `;

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
      res.json({status: 422, message: 'No conditions found.'});
      return;
    }
    queryText = queryText.slice(0, -2); // remove extra comma and space
  }

  console.log(queryText);
  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.json({status: 500, message: err});
    } else {
      res.json({status: 200, message: 'Rows returned.', data : response.rows})
    }
  });
};

// GET /accuracy
getAccuracy = (db, resource) => (req, res, next) => {
  const query = {
    player_id: req.query.player_id
  }

  var queryText = `WITH num_correct AS(SELECT player_id, CAST(COUNT(correct) as FLOAT) AS nums\
  FROM response, answer\
  WHERE response.answer_id = answer.answer_id\
  AND answer.correct = True\
  GROUP BY player_id),\
  num_total AS (SELECT player_id, CAST(COUNT(correct) as FLOAT) AS nums\
  FROM response, answer\
  WHERE response.answer_id = answer.answer_id\ 
  GROUP BY player_id)\
  SELECT player.player_name, num_correct.nums AS correct, num_total.nums - num_correct.nums AS incorrect,\
  COALESCE(num_correct.nums/num_total.nums*100, 0) AS percentage\
  FROM num_correct, num_total, player\
  WHERE num_correct.player_id = player.player_id\
  AND player.player_id = ` + query.player_id;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.json({status: 500, message: err});
    } else {
      res.json({status: 200, message: 'Rows returned.', data : response.rows})
    }
  });
};

// GET /history
getHistory = (db, resource) => (req, res, next) => {

  var queryText = `SELECT player_name, question_body, answer_body, correct, time\
  FROM player, question, answer, response\
  WHERE player.player_id = response.player_id\
  AND response.answer_id = answer.answer_id\
  AND question.question_id = answer.question_id\
  LIMIT 20`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.json({status: 500, message: err});
    } else {
      res.json({status: 200, message: 'Rows returned.', data : response.rows})
    }
  });
};

// to insert one, used with PUT
insertOne = (db, resource) => (req, res, next) => {
  const valuesObject = { ...req.body };

  // check if every column is found in req
  valuesList = resource.fields.map((val) => {
    if (valuesObject.hasOwnProperty(val)) {
      return valuesObject[val];
    } else {
      res.json({status: 422, message: `Value for column ${val} not found.`});
    }
  });

  const queryText =
    "INSERT INTO " +
    `${resource.name}(${resource.fields.toString()})` +
    `VALUES(${resource.fields.map((val, idx) => `$${idx + 1}`).toString()})`;

  db.query(queryText, valuesList, (err, response) => {
    if (err) {
      console.error("Error inserting new row:", err.detail);
      res.json({status: 500, message: err});
    } else {
      res.json({status: 200, message: 'Row inserted.', data : response.rows})
    }
  });
};

// to update one, used with PUT
updateOne = (db, resource) => (req, res, next) => {
  const valuesObject = { ...req.body };
  const conditions = valuesObject.conditions;
  delete valuesObject[conditions];

  // queryText to form SQL query
  var queryText = "UPDATE " + `${resource.name} ` + "SET ";

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
    res.json({status: 422, message: `No values to set.`});
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
    res.json({status: 422, message: `No conditions found.`});
    return;
  }

  queryText = queryText.slice(0, -2); // remove extra comma and space

  db.query(queryText, (err, response) => {
    if (err) {
      console.error("Error updating row:", err.detail);
      res.json({status: 500, message: err});
      return;
    }
    res.json({status: 200, message: 'Row(s) updated.', data : response.rows})
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

  var queryText = "DELETE FROM " + `${resource.name} ` + "WHERE ";
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
    res.json({status: 422, message: `No conditions found.`});
    return;
  }

  queryText = queryText.slice(0, -2); // remove extra comma and space

  db.query(queryText, (err, response) => {
    if (err) {
      console.error("Error updating row:", err.detail);
      res.json({status: 500, message: err});
      return;
    }
    res.json({status: 200, message: 'Row(s) deleted.', data : response.rows});
  });
};

module.exports = {
  getFunc,
  getAccuracy,
  getHistory,
  putFunc,
  deleteFunc,
};
