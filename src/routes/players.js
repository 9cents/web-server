const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

const players = require('../models/players');

// Set up Express App
const player = express();
player.use(cors());
player.use(bodyParser.json());
player.use(bodyParser.urlencoded({ extended: false }));

player.get('/get', players.getPlayers);

module.exports = player;