const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const pool = require('../database/db');

// Set up Express player
const player = express();
player.use(cors());
player.use(bodyParser.json());
player.use(bodyParser.urlencoded({ extended: false }));

const getPlayers = (request, response) => {
    pool.query('SELECT * FROM public."Player"', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

module.exports = {getPlayers};
