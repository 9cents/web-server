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

module.exports = {
  getAccuracy,
  getHistory,
};
