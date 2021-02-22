module.exports = { 
    // Comment/uncomment wherever needed
    // HOST: "172.21.148.168",
    // USER: "admin",
    // PASSWORD: "ninecent",
    // DB: "Ninecent_DB",
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "irvin123",
    DB: "Ninecent_Local",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};