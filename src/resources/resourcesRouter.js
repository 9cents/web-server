var express = require("express");
var router = express.Router();
const db = require("../database/db").getInstance();
const resourcesSchemas = require("./tableSchemas");

const { getFunc, putFunc, deleteFunc } = require("./crudFunctions");

const {
  getAccuracy,
  getProgress,
  getDungeonQuestion,
  putDungeon,
  putDungeonWeb,
  putDungeonLockWeb,
  getResponses,
} = require("./customFunctions");

const {
  getGameDungeon,
  getWorldNames,
  getWorldQuestions,
  getStoryData,
  getLeaderBoard,
} = require("./gameFunctions");

resourcesSchemas.forEach((resource) => {
  router.get(`/${resource.name}`, getFunc(db, resource));
  router.put(`/${resource.name}`, putFunc(db, resource));
  router.delete(`/${resource.name}`, deleteFunc(db, resource));
});

router.get("/accuracy", getAccuracy(db));
router.get("/progressreport", getProgress(db));
router.get("/responsedata", getResponses(db));
router.get("/dungeonquestion", getDungeonQuestion(db));
router.put("/updungeon", putDungeon(db));
router.put("/updungeonweb", putDungeonWeb(db));
router.put("/updungeonlockweb", putDungeonLockWeb(db));

router.get("/game/worldnames", getWorldNames(db));
router.get("/game/worldquestions", getWorldQuestions(db));
router.get("/game/dungeon", getGameDungeon(db));
router.get("/game/storydata", getStoryData(db));
router.get("/game/leaderboard", getLeaderBoard(db));

module.exports = router;
