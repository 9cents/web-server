// PostgreSQL connection set up
const conf = require("./db.config");
const { Pool } = require("pg");

const pgSingleton = (() => {
  
  var instance;
  init = async () => {
    instance = new Pool({
      user: conf.USER,
      host: conf.HOST,
      database: conf.DB,
      password: conf.PASSWORD,
      port: conf.PORT,
    });
  };
  getInstance = () => {
    if (!instance) {
      init();
    }

    return instance;
  };
  return {
    init: init,
    getInstance: getInstance,
  };
})();

module.exports = pgSingleton;
