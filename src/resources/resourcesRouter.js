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

module.exports = router;
