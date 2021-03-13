// GET /game/worldnames
getWorldNames = (db) => (req, res, next) => {
  const queryText = "SELECT * FROM world ORDER BY world_id;";

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      worldList = response.rows.map((val) => {
        return val["world_name"];
      });
      res.status(200).json(worldList);
    }
  });
};

// GET /game/towernames
getTowerNames = (db) => (req, res, next) => {
  const queryText = `SELECT * FROM tower ORDER BY tower_id;`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error gettings rows: ", err.detail);
      res.status(500).json({ message: err });
    } else {
      worldList = response.rows.map((val) => {
        return val["world_id"];
      });
      worldList = [...new Set(worldList)];
      towerList = worldList.map((world) => {
        return response.rows
          .filter((row) => {
            return row["world_id"] === world;
          })
          .map((val) => val["tower_name"]);
      });
      res.status(200).json(towerList);
    }
  });
};

//GET /game/worldquestions
getWorldQuestions = (db) => (req, res, next) => {
  const queryText = `SELECT world.world_id, question.question_body FROM world 
  JOIN tower on world.world_id = tower.world_id
  JOIN level on tower.tower_id = level.tower_id
  JOIN question on level.level_id = question.level_id
  ORDER BY world.world_id, tower.tower_id, level.level_id, question.question_id`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      // get list of world ids
      worldList = response.rows.map((val) => {
        return val["world_id"];
      });
      // get unique world ids only
      worldList = [...new Set(worldList)];
      // get questions only
      worldQuestions = worldList.map((world) => {
        return response.rows
          .filter((row) => {
            return row["world_id"] === world;
          })
          .map((val) => val["question_body"]);
      });
      res.status(200).json(worldQuestions);
    }
  });
};

// GET /game/storydata
getStoryData = (db) => (req, res, next) => {
  const params = req.query;
  const tower_name = params["tower_name"];
  const player_name = params["player_name"];

  if (!tower_name || !player_name) {
    res.status(422).json({ message: "Missing field in request." });
    return;
  }

  const queryText = `SELECT DISTINCT question_body, answer_body, correct
  FROM progress,tower, player, question, answer
  WHERE progress.player_id = player.player_id
  AND progress.level_id = question.level_id
  AND question.question_id = answer.question_id
  AND progress.tower_id = tower.tower_id
  AND tower.tower_name = '${tower_name}'
  AND player_name = '${player_name}';`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows: ", err.detail);
      res.status(500).json({ message: err });
    } else {
      questionList = response.rows.map((val) => val["question_body"]);
      questionList = [...new Set(questionList)];

      temp = questionList.map((qns) => {
        var correctIndex = -1;
        const answers = response.rows
          .filter((row) => row["question_body"] === qns)
          .map((val, idx) => {
            if (val["correct"]) {
              correctIndex = idx;
            }
            return val["answer_body"];
          });
        return {
          question_body: qns,
          answers: answers,
          correct: correctIndex,
        };
      });
      res.status(200).json(temp);
    }
  });
};

//GET /game/challengedata
getChallengeData = (db) => (req, res, next) => {
  const params = req.query;
  const player_name = params.player_name;

  if (!player_name) {
    res.status(422).json({ message: "Missing player name" });
    return;
  }

  queryText = `SELECT player_name, question_body, answer_body, correct
  FROM (SELECT player_name,
    unnest(array['question_1', 'question_2', 'question_3', 'question_4', 'question_5']) AS "Values",
    unnest(array[question_1, question_2, question_3, question_4, question_5]) AS "question_id"
  FROM dungeon
  ORDER BY player_name) AS d, question, answer
  WHERE d.question_id = question.question_id
  AND question.question_id = answer.question_id
  AND d.player_name = '${player_name}'
  ORDER BY player_name, question_body`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows: ", err.detail);
      res.status(500).json({ message: err });
    } else {
      questionList = response.rows.map((val) => val["question_body"]);
      questionList = [...new Set(questionList)];

      temp = questionList.map((qns) => {
        var correctIndex = -1;
        const answers = response.rows
          .filter((row) => row["question_body"] === qns)
          .map((val, idx) => {
            if (val["correct"]) {
              correctIndex = idx;
            }
            return val["answer_body"];
          });
        return {
          question_body: qns,
          answers: answers,
          correct: correctIndex,
        };
      });
      res.status(200).json(temp);
    }
  });
};

// GET /game/leaderboard
getLeaderBoard = (db) => (req, res, next) => {
  const params = req.query;
  const player_name = params["player_name"];

  queryText =
    `WITH min_level AS
    (SELECT level.tower_id, MIN(level_id)-1 AS nums FROM level, tower
    WHERE level.tower_id=tower.tower_id
    GROUP BY level.tower_id
    ORDER BY level.tower_id),
    total_level AS
    (SELECT player.player_name, SUM(progress.level_id-min_level.nums) AS total FROM player, progress, min_level
    WHERE progress.tower_id = min_level.tower_id
    AND player.player_id = progress.player_id` +
    (player_name ? ` AND player.player_name = '${player_name}' ` : ` `) +
    `GROUP BY player.player_name)
    SELECT player.player_name, COALESCE(total, 0) AS total FROM player
    LEFT JOIN total_level ON player.player_name = total_level.player_name
    ORDER BY total DESC NULLS LAST` +
    (player_name ? ` LIMIT 1` : ` LIMIT 10`);

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("error getting rows: ", err.detail);
      res.status(500).json({ message: err });
    } else {
      const data = response.rows
        .filter((val) => {
          return val["player_name"] != null;
        })
        .map((val) => [val.player_name, val.total]);
      res.status(200).json(player_name ? data[0] : data);
    }
  });
};

// PUT /game/dungeon
putGameDungeon = (db) => (req, res, next) => {
  const params = req.query;
  const player_name = params.player_name;

  if (!player_name) {
    res.status(422).json({ message: "Missing player_name field" });
  }

  const valuesObject = [...req.body];

  const queryText = `UPDATE dungeon
  SET 
  question_1 = (SELECT question_id FROM question WHERE question_body = '${valuesObject[0]}'), 
  question_2 = (SELECT question_id FROM question WHERE question_body = '${valuesObject[1]}'), 
  question_3 = (SELECT question_id FROM question WHERE question_body = '${valuesObject[2]}'),
  question_4 = (SELECT question_id FROM question WHERE question_body = '${valuesObject[3]}'),
  question_5 = (SELECT question_id FROM question WHERE question_body = '${valuesObject[4]}')
  WHERE player_name = '${player_name}';`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      res.status(200).json({
        message: `${response.rowCount} row(s) updated.`,
        data: response.rows,
      });
    }
  });
};

module.exports = {
  getWorldNames,
  getTowerNames,
  getWorldQuestions,
  getStoryData,
  getChallengeData,
  getLeaderBoard,
  putGameDungeon,
};
