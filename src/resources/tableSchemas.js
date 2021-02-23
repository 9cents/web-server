// define table schema here
// for fields, leave out primary key field if id is auto incremented

const worlds = {
  name: "world",
  fields: ["world_name"],
  primaryKey: "world_id",
};

const towers = {
  name: "tower",
  fields: ["tower_name", "lock", "world_id"],
  primaryKey: "tower_id",
};

const levels = {
  name: "level",
  fields: ["tower_id"],
  primaryKey: "level_id",
};

const questions = {
  name: "question",
  fields: ["question_body", "level_id"],
  primaryKey: "question_id",
};

const answers = {
  name: "answer",
  fields: ["answer_body", "correct", "question_id"],
  primaryKey: "answer_id",
};

const groups = {
  name: "group",
  fields: ["group_name"],
  primaryKey: ["group_id"],
};

const players = {
  name: "player",
  fields: ["player_name", "character", "password", "group_id"],
  primaryKey: "player_id",
};

const responses = {
  name: "response",
  fields: ["time", "player_id", "answer_id"],
  primaryKey: "response_id",
};

module.exports = [
  worlds,
  towers,
  levels,
  questions,
  answers,
  groups,
  players,
  responses,
];
