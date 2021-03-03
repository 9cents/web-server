// GET /accuracy
getAccuracy = (db) => (req, res, next) => {
  const query = {
    player_id: req.query.player_id,
  };

  var queryText =
    `WITH num_correct AS(SELECT player_id, CAST(COUNT(correct) as FLOAT) AS nums\
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
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Rows returned.", data: response.rows });
    }
  });
};

// GET /history
getHistory = (db) => (req, res, next) => {
  var queryText = `SELECT player_name, question_body, answer_body, correct, time\
  FROM player, question, answer, response\
  WHERE player.player_id = response.player_id\
  AND response.answer_id = answer.answer_id\
  AND question.question_id = answer.question_id\
  LIMIT 20`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Rows returned.", data: response.rows });
    }
  });
};

getResponses = (db) => (req, res, next) => {
  var queryText = `SELECT response_id, question_body, answer_body, correct, time \
  FROM response, question, answer \
  WHERE response.answer_id = answer.answer_id \
  AND answer.question_id = question.question_id \
  AND player.player_id = ${req.query.player_id}`
  console.log(queryText)

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Rows returned.", data: response.rows });
    }
  });
};

// GET /dungeonquestion
getDungeonQuestion = (db) => (req, res, next) => {
  const query = {
    question_1: req.query.question_1,
    question_2: req.query.question_2,
    question_3: req.query.question_3,
    question_4: req.query.question_4,
    question_5: req.query.question_5,
  };

  var queryText = `SELECT question_id, question_body FROM question, instructor \
  WHERE instructor_id = 1 \
  AND question_id <> ` + query.question_1 + ` \
  AND question_id <> ` + query.question_2 + ` \
  AND question_id <> ` + query.question_3 + ` \
  AND question_id <> ` + query.question_4 + ` \
  AND question_id <> ` + query.question_5 + ``;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Questions returned.", data: response.rows });
    }
  });
};

// PUT /updungeon
putDungeon = (db) => (req, res, next) => {
  const query = {
    player_id: req.body.player_id,
    id_1: req.body.id_1,
    id_2: req.body.id_2,
    id_3: req.body.id_3,
    id_4: req.body.id_4,
    id_5: req.body.id_5,
  };

  var queryText =
    `UPDATE dungeon \
  SET lock = False, question_1 = ` +
    query.id_1 +
    `, question_2 = ` +
    query.id_2 +
    `, question_3 = ` +
    query.id_3 +
    `, question_4 = ` +
    query.id_4 +
    `, question_5 = ` +
    query.id_5 +
    ` WHERE player_name = (SELECT player_name FROM player \
    WHERE player_id = ` +
    query.player_id +
    `)`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Dungeon updated." });
    }
  });
};

// PUT /updungeonweb
putDungeonWeb = (db) => (req, res, next) => {
  const query = {
    instructor_id: req.body.instructor_id,
    id_1: req.body.id_1,
    id_2: req.body.id_2,
    id_3: req.body.id_3,
    id_4: req.body.id_4,
    id_5: req.body.id_5,
  };

  var queryText =
    `UPDATE instructor \
  SET question_1 = ` +
    query.id_1 +
    `, question_2 = ` +
    query.id_2 +
    `, question_3 = ` +
    query.id_3 +
    `, question_4 = ` +
    query.id_4 +
    `, question_5 = ` +
    query.id_5 +
    ` WHERE instructor_id = ` +
    query.instructor_id;

  console.log(queryText);

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Dungeon updated." });
    }
  });
};

// PUT /updungeonweb
putDungeonLockWeb = (db) => (req, res, next) => {
  const query = {
    instructor_id: req.body.instructor_id,
  };

  var queryText =
    `UPDATE instructor \
  SET lock = NOT lock \
  WHERE instructor_id = ` + query.instructor_id;

  console.log(queryText);

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({ message: "Dungeon Lock updated." });
    }
  });
};

module.exports = {
  getAccuracy,
  getHistory,
  getResponses,
  getDungeonQuestion,
  putDungeon,
  putDungeonWeb,
  putDungeonLockWeb,
};
