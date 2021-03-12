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

// GET /game/dungeon
getGameDungeon = (db) => (req, res, next) => {
  const query = req.query;

  const player_name = query["player_name"];

  //
  var queryText = `SELECT player_name, 
  q1.question_body as question1,
  q2.question_body as question2,
  q3.question_body as question3,
  q4.question_body as question4,
  q5.question_body as question5
  FROM dungeon 
  JOIN question as q1 ON (dungeon.question_1 = q1.question_id)
  JOIN question as q2 ON (dungeon.question_2 = q2.question_id)
  JOIN question as q3 ON (dungeon.question_3 = q3.question_id)
  JOIN question as q4 ON (dungeon.question_4 = q4.question_id)
  JOIN question as q5 ON (dungeon.question_5 = q5.question_id)
  WHERE player_name = '${player_name}'
 `;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
      res.status(500).json({ message: err });
    } else {
      // format into questionList
      // ["question1", "question2", "question3", "question4", "question5"]
      questions = response.rows[0];
      questionList = [
        "question1",
        "question2",
        "question3",
        "question4",
        "question5",
      ].map((val) => {
        if (questions) {
          return questions[val] || "";
        } else return "";
      });
      res.status(200).json(questionList);
    }
  });
};

// GET /game/storydata
getStoryData = (db) => (req, res, next) => {
  queryText = `SELECT question_body, answer_body, correct 
  FROM question
  JOIN answer ON question.question_id = answer.question_id`;

  db.query(queryText, (err, response) => {
    if (err) {
      console.log("Error getting rows:", err.detail);
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

module.exports = {
  getWorldNames,
  getWorldQuestions,
  getGameDungeon,
  getStoryData,
  getLeaderBoard,
};
