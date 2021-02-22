var express = require("express");
var router = express.Router();
const db = require("../database/db").getInstance();
const { questions } = require("./tableSchemas");

const { getAll, insertOne } = require("./commons");

router.get("/", getAll(db, questions));
router.post("/", insertOne(db, questions));
router.put("/", updateOne(db, questions));
router.delete("/");

module.exports = router;
