// define table schema here
// for fields, leave out primary key field if id is auto incremented

const worlds = {
  name: "worlds",
  fields: ["world_name"],
  primaryKey: "world_id",
};

const towers = {
  name: "towers",
  fields: ["tower_name", "lock"],
  primaryKey: "tower_id",
};

const levels = {
  name: "levels",
  fields: [],
  primaryKey: "level_id",
};

const questions = {
  name: "questions",
  fields: ["body"],
  primaryKey: "question_id",
};

const answers = {
  name: "answers",
  fields: ["answer_body", "correct"],
  primaryKey: "answer_id",
};

const groups = {
  name: "groups",
  fields: ["group_name"],
  primaryKey: ["group_id"],
};

const players = {
  name: "players",
  fields: ["user_name", "character", "password"],
  primaryKey: "player_id",
};

const responses = {
  name: "responses",
  fields: ["time"],
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
