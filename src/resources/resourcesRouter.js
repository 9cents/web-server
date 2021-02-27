var express = require("express");
var router = express.Router();
const db = require("../database/db").getInstance();
const resourcesSchemas = require("./tableSchemas");

const { getFunc, putFunc, deleteFunc } = require("./crudFunctions");

const { getAccuracy, getHistory } = require("./customFunctions");

resourcesSchemas.forEach((resource) => {
  // disallow inserting or updating player/instructor directly
  if (resource.name === "player" || resource.name === "instructor") {
    router.get(`/${resource.name}`, getFunc(db, resource));
    router.delete(`/${resource.name}`, deleteFunc(db, resource));
  } else {
    router.get(`/${resource.name}`, getFunc(db, resource));
    router.put(`/${resource.name}`, putFunc(db, resource));
    router.delete(`/${resource.name}`, deleteFunc(db, resource));
  }
});

router.get("/accuracy", getAccuracy(db));
router.get("/history", getHistory(db));

module.exports = router;
