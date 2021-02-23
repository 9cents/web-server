var express = require("express");
var router = express.Router();
const db = require("../database/db").getInstance();
const resourcesSchemas = require("./tableSchemas");

const { getFunc, getAccuracy, getHistory, putFunc, deleteFunc } = require("./crudFunctions");

resourcesSchemas.forEach((resource) => {
  router.get('/accuracy', getAccuracy(db, resource));
  router.get('/history', getHistory(db, resource));
  router.get(`/${resource.name}`, getFunc(db, resource));
  router.put(`/${resource.name}`, putFunc(db, resource));
  router.delete(`/${resource.name}`, deleteFunc(db, resource));
});

module.exports = router;
