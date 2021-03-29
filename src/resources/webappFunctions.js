/** @module Webapp_Functions */

// GET /countplayers
/**
 * @name getCountPlayers
 * @description Returns middleware that retreives number of players and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getCountPlayersMiddleware]{@link module:Game_Functions~getCountPlayersMiddleware} - The middleware function
 */
getCountPlayers = (db) =>
  /**
   * @name getCountPlayersMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    var queryText = `SELECT COUNT(*) FROM player;`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({
          message: "Number of players returned.",
          data: response.rows[0].count,
        });
      }
    });
  };

// GET /counttowers
/**
 * @name getCountTowers
 * @description Returns middleware that retreives number of towers and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getCountTowersMiddleware]{@link module:Game_Functions~getCountTowersMiddleware} - The middleware function
 */
getCountTowers = (db) =>
  /**
   * @name getCountTowersMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    var queryText = `SELECT COUNT(*) FROM tower;`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({
          message: "Number of towers returned.",
          data: response.rows[0].count,
        });
      }
    });
  };

// GET /countlevels
/**
 * @name getCountLevels
 * @description Returns middleware that retreives number of questions and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getCountLevelsMiddleware]{@link module:Game_Functions~getCountLevelsMiddleware} - The middleware function
 */
getCountLevels = (db) =>
  /**
   * @name getCountLevelsMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    var queryText = `SELECT COUNT(*) FROM level;`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({
          message: "Number of levels returned.",
          data: response.rows[0].count,
        });
      }
    });
  };

// GET /countquestions
/**
 * @name getCountQuestions
 * @description Returns middleware that retreives number of questions and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getCountQuestionsMiddleware]{@link module:Game_Functions~getCountQuestionsMiddleware} - The middleware function
 */
getCountQuestions = (db) =>
  /**
   * @name getCountQuestionsMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    var queryText = `SELECT COUNT(*) FROM question;`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({
          message: "Number of questions returned.",
          data: response.rows[0].count,
        });
      }
    });
  };

// GET /countresponses
/**
 * @name getCountResponses
 * @description Returns middleware that retreives number of responses and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getCountResponsesMiddleware]{@link module:Game_Functions~getCountResponsesMiddleware} - The middleware function
 */
getCountResponses = (db) =>
  /**
   * @name getCountResponsesMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    var queryText = `SELECT COUNT(*) FROM response;`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res.status(200).json({
          message: "Number of responses returned.",
          data: response.rows[0].count,
        });
      }
    });
  };

// GET /questionaccuracy
/**
 * @name getQuestionAccuracy
 * @description Returns middleware that retreives a specified player's question accuracy in game and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getQuestionAccuracyMiddleware]{@link module:Game_Functions~getQuestionAccuracyMiddleware} - The middleware function
 */
getQuestionAccuracy = (db) =>
  /**
   * @name getQuestionAccuracyMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    const query = {
      player_id: req.query.player_id,
    };

    var queryText = `WITH qnresponse AS
    (SELECT question.question_id, COUNT(*) AS total
     FROM question, response, answer
    WHERE response.answer_id = answer.answer_id
    AND answer.question_id = question.question_id
    GROUP BY question.question_id),
    
    qncorrect AS
    (SELECT question.question_id, COUNT(*) AS correct
     FROM question, response, answer
    WHERE response.answer_id = answer.answer_id
    AND answer.question_id = question.question_id
     AND answer.correct = True
    GROUP BY question.question_id),
    
    qnsummary AS
    (SELECT qnresponse.question_id, 
     CAST(COALESCE(correct,0) as FLOAT) AS correct, 
     CAST(total as FLOAT)
     FROM qnresponse JOIN qncorrect 
     ON qnresponse.question_id = qncorrect.question_id)
    
    SELECT question_body, answer_body, tower_name, 
    COALESCE(qnsummary.correct/total*100, 0) AS accuracy
    FROM question, qnsummary, level, tower, answer
    WHERE question.question_id = qnsummary.question_id
    AND question.level_id = level.level_id
    AND level.tower_id = tower.tower_id
    AND question.question_id = answer.question_id
    AND answer.correct = True
    ORDER BY accuracy
    LIMIT 30`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res
          .status(200)
          .json({
            message: "Question accuracy returned.",
            data: response.rows,
          });
      }
    });
  };

// GET /accuracy
/**
 * @name getAccuracy
 * @description Returns middleware that retreives a specified player's accuracy in game and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getAccuracyMiddleware]{@link module:Game_Functions~getAccuracyMiddleware} - The middleware function
 */
getAccuracy = (db) =>
  /**
   * @name getAccuracyMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
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
  AND num_total.player_id = player.player_id\
  AND player.player_id = ` + query.player_id;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res
          .status(200)
          .json({ message: "Accuracy returned.", data: response.rows });
      }
    });
  };

// GET /progressreport
/**
 * @name getProgress
 * @description Returns middleware that retreives a specified player's progress in game and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getProgressMiddleware]{@link module:Game_Functions~getProgressMiddleware} - The middleware function
 */
getProgress = (db) =>
  /**
   * @name getProgressMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    const query = {
      player_id: req.query.player_id,
    };

    var queryText = `WITH num_level AS
    (SELECT level.tower_id, MAX(level_id)-MIN(level_id)+1 AS nums FROM level, tower
    WHERE level.tower_id=tower.tower_id
    GROUP BY level.tower_id
    ORDER BY level.tower_id),
    
    current_progress AS
    (SELECT tower_id, level_id AS current FROM player, progress
    WHERE progress.player_id = player.player_id
    AND player.player_id = $1),

    min_level AS
    (SELECT level.tower_id, MIN(level_id)-1 AS nums FROM level, tower
    WHERE level.tower_id=tower.tower_id
    GROUP BY level.tower_id
    ORDER BY level.tower_id),

    level_progress AS
    (SELECT current_progress.tower_id, current_progress.current-min_level.nums AS current FROM current_progress, min_level
    WHERE current_progress.tower_id = min_level.tower_id
    ),
    
    num_correct AS
    (SELECT level.tower_id, CAST(COUNT(correct) as FLOAT) AS nums
    FROM response, answer, question, level
    WHERE response.answer_id = answer.answer_id
    AND answer.question_id = question.question_id
    AND question.level_id = level.level_id
    AND answer.correct = True
    AND player_id = $2 GROUP BY level.tower_id),
      
    num_total AS
    (SELECT level.tower_id, CAST(COUNT(correct) as FLOAT) AS nums
    FROM response, answer, question, level
    WHERE response.answer_id = answer.answer_id
    AND answer.question_id = question.question_id
    AND question.level_id = level.level_id
    AND player_id = $3 GROUP BY level.tower_id),
      
    percentage AS
    (SELECT num_correct.tower_id, COALESCE(num_correct.nums/num_total.nums*100, 0) AS accuracy
    FROM num_correct, num_total
    WHERE num_correct.tower_id = num_total.tower_id)
    
    SELECT tower.tower_name, COALESCE(current, 0) AS level, COALESCE(nums, 0) AS total, COALESCE(accuracy, 0) AS accuracy FROM tower 
    LEFT JOIN num_level ON tower.tower_id = num_level.tower_id
    LEFT JOIN level_progress ON tower.tower_id = level_progress.tower_id
    LEFT JOIN percentage ON tower.tower_id = percentage.tower_id
    ORDER BY tower.tower_id`;

    db.query(
      queryText,
      [query.player_id, query.player_id, query.player_id],
      (err, response) => {
        if (err) {
          console.log("Error getting rows:", err.detail);
          res.status(500).json({ message: err });
        } else {
          res
            .status(200)
            .json({ message: "Progress returned.", data: response.rows });
        }
      }
    );
  };

// GET /responsedata
/**
 * @name getAccuracy
 * @description Returns middleware that retreives a specified player's responses in game and sends as response.
 * @function
 * @param {object} db - The postpresql db instance
 * @return {function} [getResponsesMiddleware]{@link module:Game_Functions~getResponsesMiddleware} - The middleware function
 */
getResponses = (db) =>
  /**
   * @name getResponsesMiddleware
   * @function
   * @param req {Object} The request
   * @param res {Object} The response
   * @param {Function} next The next middleware
   *
   */
  (req, res, next) => {
    var queryText = `SELECT response_id, question_body, answer_body, correct
  FROM response, question, answer
  WHERE response.answer_id = answer.answer_id
  AND answer.question_id = question.question_id
  AND response.player_id = ${req.query.player_id}
  ORDER BY response_id DESC`;

    db.query(queryText, (err, response) => {
      if (err) {
        console.log("Error getting rows:", err.detail);
        res.status(500).json({ message: err });
      } else {
        res
          .status(200)
          .json({ message: "Responses returned.", data: response.rows });
      }
    });
  };

module.exports = {
  getCountPlayers,
  getCountTowers,
  getCountLevels,
  getCountQuestions,
  getCountResponses,
  getQuestionAccuracy,
  getAccuracy,
  getProgress,
  getResponses,
};
