var express = require("express");
var router = express.Router();
const db = require("../database/db").getInstance();
const resourcesSchemas = require("./tableSchemas");

const { getFunc, putFunc, deleteFunc } = require("./crudFunctions");

const {
  getCountPlayers,
  getCountTowers,
  getCountLevels,
  getCountQuestions,
  getCountResponses,
  getAccuracy,
  getProgress,
  getDungeonQuestion,
  putDungeon,
  putDungeonWeb,
  putDungeonLockWeb,
  getResponses,
  getQuestionAccuracy,
} = require("./webappFunctions");

resourcesSchemas.forEach((resource) => {
  router.get(`/${resource.name}`, getFunc(db, resource));
  router.put(`/${resource.name}`, putFunc(db, resource));
  router.delete(`/${resource.name}`, deleteFunc(db, resource));
});

router.get("/countplayers", getCountPlayers(db));
router.get("/counttowers", getCountTowers(db));
router.get("/countlevels", getCountLevels(db));
router.get("/countquestions", getCountQuestions(db));
router.get("/countresponses", getCountResponses(db));
router.get("/questionaccuracy", getQuestionAccuracy(db));
router.get("/accuracy", getAccuracy(db));
router.get("/progressreport", getProgress(db));
router.get("/responsedata", getResponses(db));
router.get("/dungeonquestion", getDungeonQuestion(db));
router.put("/updungeon", putDungeon(db));
router.put("/updungeonweb", putDungeonWeb(db));
router.put("/updungeonlockweb", putDungeonLockWeb(db));

module.exports = router;
