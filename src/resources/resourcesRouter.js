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
  getWorldNames,
  getWorldQuestions,
  getStoryData,
  getChallengeData,
  getLeaderBoard,
  putGameDungeon,
  getInstructorDungeon,
  putGameResponse,
  putIncrementLevel,
  putDecrementLevel,
  getTowerNames,
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
router.get("/game/towernames", getTowerNames(db));
router.get("/game/storydata", getStoryData(db));
router.get("/game/challengedata", getChallengeData(db));
router.get("/game/leaderboard", getLeaderBoard(db));
router.get("/game/instructordungeon", getInstructorDungeon(db));
router.put("/game/dungeon", putGameDungeon(db));
router.put("/game/response", putGameResponse(db));
router.put("/game/increment", putIncrementLevel(db));
router.put("/game/decrement", putDecrementLevel(db));

module.exports = router;
