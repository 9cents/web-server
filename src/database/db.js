// PostgreSQL connection set up
const { Pool } = require("pg");

const pgSingleton = (() => {
  var instance;
  init = async () => {
    instance = new Pool();
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
